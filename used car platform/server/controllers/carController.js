const Car = require('../models/Car');
const User = require('../models/User');
const {
  validatePrice,
  validateModelYear,
  validateKmsDriven,
  validateOwnership,
  validateSeats,
  validateFuelType,
  validateTransmission,
  validateDescription,
  validateName,
  sanitizeString,
} = require('../utils/validators');


exports.getAllCars = async (req, res) => {
  try {
    const {
      minPrice = 0,
      maxPrice = 10000000,
      minYear = 1990,
      maxYear = 2100,
      minKms = 0,
      maxKms = 2000000,
      sortBy = 'newest'
    } = req.query;

    // Build filter object
    const filters = {
      price: { $gte: minPrice, $lte: maxPrice },
      modelYear: { $gte: minYear, $lte: maxYear },
      kmsDriven: { $gte: minKms, $lte: maxKms }
    };

    // Convert strings to numbers for proper comparison
    filters.price.$gte = parseFloat(minPrice) || 0;
    filters.price.$lte = parseFloat(maxPrice) || 10000000;
    filters.modelYear.$gte = parseInt(minYear) || 1990;
    filters.modelYear.$lte = parseInt(maxYear) || 2100;
    filters.kmsDriven.$gte = parseInt(minKms) || 0;
    filters.kmsDriven.$lte = parseInt(maxKms) || 2000000;

    // Determine sort option
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    switch (sortBy) {
      case 'priceAsc':
        sortOption = { price: 1 };
        break;
      case 'priceDesc':
        sortOption = { price: -1 };
        break;
      case 'yearAsc':
        sortOption = { modelYear: 1 };
        break;
      case 'yearDesc':
        sortOption = { modelYear: -1 };
        break;
      case 'favorited':
        sortOption = { 'favoriteBy': -1 }; // Most favorites first
        break;
      default:
        sortOption = { createdAt: -1 }; // newest
    }

    const cars = await Car.find(filters).sort(sortOption).populate('ownerId', 'name email phone');
    
    console.log(`🔍 Filtered cars: ${cars.length} results (price: ${minPrice}-${maxPrice}, year: ${minYear}-${maxYear}, kms: ${minKms}-${maxKms}, sort: ${sortBy})`);
    res.json(cars);
  } catch (err) {
    console.error('Get all cars error:', err.message);
    res.status(500).json({ message: '❌ Failed to load cars. Please refresh and try again.' });
  }
};


exports.createCar = async (req, res) => {
  try {
    const { name, price, modelYear, fuelType, transmission, kmsDriven, ownership, seats, description, photo } = req.body;

    console.log('📝 Creating car with data:', {
      name,
      price: typeof price,
      modelYear: typeof modelYear,
      fuelType,
      transmission,
      kmsDriven: typeof kmsDriven,
      ownership: typeof ownership,
      seats: typeof seats,
      photoLength: photo ? photo.length : 0,
      userId: req.user.id,
      userPhone: req.user.phone
    });

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ message: `❌ ${nameValidation.error}` });
    }

    // Check photo size (limit to 5MB)
    if (photo && photo.length > 5242880) { // 5MB in bytes (Base64 is ~1.33x larger)
      return res.status(400).json({ message: '❌ Photo is too large. Please use a smaller image (max 5MB).' });
    }

    // Validate price
    const priceValidation = validatePrice(price);
    if (!priceValidation.valid) {
      return res.status(400).json({ message: `❌ ${priceValidation.error}` });
    }

    // Validate model year
    const yearValidation = validateModelYear(modelYear);
    if (!yearValidation.valid) {
      return res.status(400).json({ message: `❌ ${yearValidation.error}` });
    }

    // Validate fuel type
    const fuelValidation = validateFuelType(fuelType);
    if (!fuelValidation.valid) {
      return res.status(400).json({ message: `❌ ${fuelValidation.error}` });
    }

    // Validate transmission
    const transmissionValidation = validateTransmission(transmission);
    if (!transmissionValidation.valid) {
      return res.status(400).json({ message: `❌ ${transmissionValidation.error}` });
    }

    // Validate KMs driven
    const kmsValidation = validateKmsDriven(kmsDriven);
    if (!kmsValidation.valid) {
      return res.status(400).json({ message: `❌ ${kmsValidation.error}` });
    }

    // Validate ownership
    const ownershipValidation = validateOwnership(ownership);
    if (!ownershipValidation.valid) {
      return res.status(400).json({ message: `❌ ${ownershipValidation.error}` });
    }

    // Validate seats
    const seatsValidation = validateSeats(seats);
    if (!seatsValidation.valid) {
      return res.status(400).json({ message: `❌ ${seatsValidation.error}` });
    }

    // Validate description (optional)
    let descriptionValue = description || '';
    if (description) {
      const descValidation = validateDescription(description);
      if (!descValidation.valid) {
        return res.status(400).json({ message: `❌ ${descValidation.error}` });
      }
      descriptionValue = descValidation.value;
    }

    // Sanitize string fields
    const sanitizedName = sanitizeString(nameValidation.value);
    const sanitizedDescription = sanitizeString(descriptionValue);

    const newCar = await Car.create({
      name: sanitizedName,
      price: priceValidation.value,
      photo: photo || '',
      ownerId: req.user.id,
      ownerPhone: req.user.phone || '',
      modelYear: yearValidation.value,
      fuelType: fuelValidation.value,
      transmission: transmissionValidation.value,
      kmsDriven: kmsValidation.value,
      ownership: ownershipValidation.value,
      seats: seatsValidation.value,
      description: sanitizedDescription,
    });

    // Add car to user's carListings
    await User.findByIdAndUpdate(req.user.id, {
      $push: { carListings: newCar._id }
    });

    console.log('✅ Car created successfully:', newCar._id);
    res.status(201).json({ message: '✅ Car listed successfully!', car: newCar });
  } catch (err) {
    console.error('Create car error - Full details:', err);
    console.error('Error message:', err.message);
    console.error('Error name:', err.name);
    console.error('Error stack:', err.stack);

    // Handle validation errors from schema
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: `❌ ${messages.join(', ')}` });
    }

    // Return detailed error for debugging
    res.status(500).json({ 
      message: '❌ Failed to create car listing. Please try again.',
      error: err.message 
    });
  }
};


exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: '❌ Car not found. It may have been deleted.' });
    }

    if (car.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ You can only edit your own car listings.' });
    }

    const updateData = { ...req.body };

    // Validate fields if they're being updated
    if (updateData.name !== undefined) {
      const nameValidation = validateName(updateData.name);
      if (!nameValidation.valid) {
        return res.status(400).json({ message: `❌ ${nameValidation.error}` });
      }
      updateData.name = sanitizeString(nameValidation.value);
    }

    if (updateData.price !== undefined) {
      const priceValidation = validatePrice(updateData.price);
      if (!priceValidation.valid) {
        return res.status(400).json({ message: `❌ ${priceValidation.error}` });
      }
      updateData.price = priceValidation.value;
    }

    if (updateData.modelYear !== undefined) {
      const yearValidation = validateModelYear(updateData.modelYear);
      if (!yearValidation.valid) {
        return res.status(400).json({ message: `❌ ${yearValidation.error}` });
      }
      updateData.modelYear = yearValidation.value;
    }

    if (updateData.fuelType !== undefined) {
      const fuelValidation = validateFuelType(updateData.fuelType);
      if (!fuelValidation.valid) {
        return res.status(400).json({ message: `❌ ${fuelValidation.error}` });
      }
      updateData.fuelType = fuelValidation.value;
    }

    if (updateData.transmission !== undefined) {
      const transmissionValidation = validateTransmission(updateData.transmission);
      if (!transmissionValidation.valid) {
        return res.status(400).json({ message: `❌ ${transmissionValidation.error}` });
      }
      updateData.transmission = transmissionValidation.value;
    }

    if (updateData.kmsDriven !== undefined) {
      const kmsValidation = validateKmsDriven(updateData.kmsDriven);
      if (!kmsValidation.valid) {
        return res.status(400).json({ message: `❌ ${kmsValidation.error}` });
      }
      updateData.kmsDriven = kmsValidation.value;
    }

    if (updateData.ownership !== undefined) {
      const ownershipValidation = validateOwnership(updateData.ownership);
      if (!ownershipValidation.valid) {
        return res.status(400).json({ message: `❌ ${ownershipValidation.error}` });
      }
      updateData.ownership = ownershipValidation.value;
    }

    if (updateData.seats !== undefined) {
      const seatsValidation = validateSeats(updateData.seats);
      if (!seatsValidation.valid) {
        return res.status(400).json({ message: `❌ ${seatsValidation.error}` });
      }
      updateData.seats = seatsValidation.value;
    }

    if (updateData.description !== undefined) {
      if (updateData.description) {
        const descValidation = validateDescription(updateData.description);
        if (!descValidation.valid) {
          return res.status(400).json({ message: `❌ ${descValidation.error}` });
        }
        updateData.description = sanitizeString(descValidation.value);
      }
    }

    const updated = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log('✅ Car updated successfully:', updated._id);
    res.json({ message: '✅ Car listing updated successfully!', car: updated });
  } catch (err) {
    console.error('Update car error:', err.message);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: `❌ ${messages.join(', ')}` });
    }

    res.status(500).json({ message: '❌ Failed to update car listing. Please try again.' });
  }
};


exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: '❌ Car not found. It may have already been deleted.' });
    }

    if (car.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: '❌ You can only delete your own car listings.' });
    }

    await car.deleteOne();
    
    // Remove car from user's carListings
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { carListings: car._id }
    });

    console.log('✅ Car deleted successfully:', car._id);
    res.json({ message: '✅ Car listing deleted successfully!' });
  } catch (err) {
    console.error('Delete car error:', err.message);
    res.status(500).json({ message: '❌ Failed to delete car listing. Please try again.' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { carId } = req.params;
    const userId = req.user.id;

    if (!carId) {
      return res.status(400).json({ message: '❌ Car ID is required.' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: '❌ Car not found. It may have been deleted.' });
    }

    const isFavorited = car.favoriteBy.includes(userId);

    if (isFavorited) {
      car.favoriteBy = car.favoriteBy.filter(id => id.toString() !== userId);
      console.log(`❤️ Removed ${userId} from favorites of car: ${carId}`);
      res.json({ 
        message: '✅ Removed from favorites',
        isFavorite: false,
        car 
      });
    } else {
      car.favoriteBy.push(userId);
      console.log(`❤️ Added ${userId} to favorites of car: ${carId}`);
      res.json({ 
        message: '✅ Added to favorites',
        isFavorite: true,
        car 
      });
    }

    await car.save();
  } catch (err) {
    console.error('Toggle favorite error:', err.message);
    res.status(500).json({ message: '❌ Failed to update favorite. Please try again.' });
  }
};


exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const favoriteCars = await Car.find({ favoriteBy: userId }).sort({ createdAt: -1 });
    
    console.log(`📱 Found ${favoriteCars.length} favorites for user: ${userId}`);
    
    res.json(favoriteCars);
  } catch (err) {
    console.error('Get favorites error:', err.message);
    res.status(500).json({ message: '❌ Failed to load your favorites. Please try again.' });
  }
};