import User from "../models/user-model.js";

class UserRepository {
  async createUser(data) {
    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return await user.save();
  }

  async getSingleUser(query) {
    return await User.findOne(query).lean(true); // can be used to query any parameter existing in the doc
  }

  async atomicUserUpdate(id, record) {
    return await User.findByIdAndUpdate(
      { _id: id },
      {
        ...record,
      }
    );
  }
}

export default new UserRepository();
