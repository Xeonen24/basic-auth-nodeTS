import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    address: String,
    contact: String,
    email: {
        type: String, unique: true, required: true, vaildate: {
            validator: function (v: string) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`
        }
    },
    profileImage: String,
});

const User = mongoose.model('User', userSchema);
export default User;