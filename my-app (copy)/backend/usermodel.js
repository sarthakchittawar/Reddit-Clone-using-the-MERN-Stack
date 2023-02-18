const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String,
            required: true,
        }
    },
    uname: {
        type: String,
        required: true,
        index: {unique: true}
    },
    email: {
        type: String,
        required: true,
        index: {unique: true}
    },
    age: {
        type: Number,
        default: 0,
    },
    contact: {
        type: Number
    },
    passwd: {
        type: String,
        required: true
    }
});

UserSchema.methods.validatePasswd = function (passwd) {
    return bcrypt.compare(passwd, this.passwd);
}

UserSchema.methods.generateToken = function () {
    const payload = {
        user: {
            id: this._id
        }
    }
    const secretkey = process.env.SECRET_KEY
    const token = jwt.sign(payload, secretkey, {expiresIn: 36000});

    return token;
}

const User = mongoose.model("User", UserSchema);
module.exports = User;