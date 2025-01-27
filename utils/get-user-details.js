import { User } from "../models/user.js";
const getUserDetails = async (userId) => {
    try {
        const user = await User.findById(userId);
        const userDetails = {
            age: user.age,
            gender: user.gender,
            allergies: user.allergies,
            diseases: user.diseases,
        };
        return userDetails;
    } catch (error) {
        return null;
    }
};

export { getUserDetails };