const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is installed, package.json says yes

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        enum: ["Landlord", "Tenant", "Admin"],
        required: true,
        // Removed immutable and default "admin" to allow normal user registration
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    profilePicture: {
        type: String,
        default: null
    }

}, { timestamps: true });


// ------------------------------
// Hash Password Before Save
// ------------------------------
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


// ------------------------------
// Compare Password
// ------------------------------
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
