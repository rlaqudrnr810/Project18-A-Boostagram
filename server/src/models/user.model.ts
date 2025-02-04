import mongoose from 'mongoose';

const notiOptions = new mongoose.Schema({
  like: String,
  comment: String,
  commentLike: String,
});

const notiContents = new mongoose.Schema(
  {
    profileImg: String,
    userName: String,
    notiType: String,
    isChecked: Boolean,
    content: String,
    created: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const followSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    userName: String,
    profileImg: String,
  },
  { _id: false },
);

const userSchema = new mongoose.Schema({
  name: String,
  userId: mongoose.Schema.Types.ObjectId,
  userName: String,
  email: String,
  password: String,
  profileImg: String,
  feedCount: { type: Number, default: 0 },
  follow: [followSchema],
  follower: [followSchema],
  notiOptions,
  notiContents: [notiContents],
});

userSchema.methods.createUser = async function createUser() {
  const result = await mongoose
    .model('User')
    .create({ userName: this.userName, profileImg: this.profileImg });
  return result;
};

userSchema.methods.findUserName = async function findUserName() {
  const result = await mongoose
    .model('User')
    .findOne({ userName: this.userName });
  return result;
};

userSchema.methods.findUserId = async function findUserId() {
  const result = await mongoose.model('User').findOne({ _id: this.userId });
  return result;
};

userSchema.methods.findUserSuggest = async function findUserSuggest() {
  const { userName } = this;
  const regex = new RegExp(userName, 'gi');
  const result = await mongoose
    .model('User')
    .find(
      { userName: { $regex: regex } },
      { __v: false, follow: false, follower: false },
    );
  return result;
};

userSchema.methods.addFeedCount = async function addFeedCount() {
  const { userId } = this;
  const result = await mongoose
    .model('User')
    .updateOne({ _id: userId }, { $inc: { feedCount: 1 } });
  return result;
};

export interface IFollow {
  userId: mongoose.Schema.Types.ObjectId;
  name?: string;
  userName: string;
  profileImg?: string;
}

export interface InotiOptions {
  like: string;
  comment: string;
  commentLike: string;
}

export interface InotiContents {
  profileImg: string;
  userName: string;
  notiType: string;
  isChecked: boolean;
  content: string;
}

export interface ISearch {
  userNames: [
    {
      userId: mongoose.Schema.Types.ObjectId;
      userName: string;
      name?: string;
      profileImg: string;
    },
  ];
}

userSchema.methods.createFollow = async function createfollow(
  user: IFollow,
  target: IFollow,
) {
  const result =
    (await mongoose.model('User').updateOne(
      { _id: user.userId },
      {
        $push: {
          follow: {
            userId: target.userId,
            name: target.name,
            userName: target.userName,
            profileImg: target.profileImg,
          },
        },
      },
    )) &&
    (await mongoose.model('User').updateOne(
      { _id: target.userId },
      {
        $push: {
          follower: {
            userId: user.userId,
            name: user.name,
            userName: user.userName,
            profileImg: user.profileImg,
          },
        },
      },
    ));
  return result;
};

userSchema.methods.deleteFollow = async function deletefollow(
  user: IFollow,
  target: IFollow,
) {
  const result =
    (await mongoose.model('User').updateOne(
      { _id: user.userId },
      {
        $pull: {
          follow: {
            userId: target.userId,
          },
        },
      },
    )) &&
    (await mongoose.model('User').updateOne(
      { _id: target.userId },
      {
        $pull: {
          follower: {
            userId: user.userId,
          },
        },
      },
    ));
  return result;
};

userSchema.methods.updateNoti = async function updateNoti(newNotiContent: any) {
  const result = await mongoose.model('User').updateMany(
    {
      _id: this.userId,
    },
    {
      $set: {
        notiContents: newNotiContent,
      },
    },
  );
  return result;
  // const result = await mongoose.model('User').updateMany(
  //   {
  //     _id: this.userId,
  //   },
  //   {
  //     $set: {
  //       'notiContents.$[].isChecked': true,
  //     },
  //   },
  // );
  // await mongoose
  //   .model('User')
  //   .findOne({ _id: this.userId })
  //   .forEach((doc: any) => {
  //     doc.notiContents.forEach((item: any) => {
  //       if (!item.isChecked) {
  //         item.isChecked = true;
  //       }
  //     });
  //     await mongoose.model('User').save(doc);
  //   });
  // return true;
};

userSchema.methods.upsertNoti = async function upsertNoti(data: any) {
  const exist = await mongoose.model('User').findOne({
    userName: data.to,
    notiContents: {
      $elemMatch: {
        userName: data.notiContent.userName,
        notiType: data.notiContent.notiType,
        content: data.notiContent.content,
      },
    },
  });

  if (exist === null) {
    const result = await mongoose.model('User').updateOne(
      {
        userName: data.to,
      },
      {
        $push: {
          notiContents: data.notiContent,
        },
      },
    );

    if (result) return true;
    return false;
  }

  return false;
};

export interface IUser extends mongoose.Document {
  name?: string;
  userName: string;
  userId?: string;
  email?: string;
  password?: string;
  profileImg?: string;
  feedCount?: number;
  follow?: Array<IFollow>;
  follower?: Array<IFollow>;
  notiOptions?: InotiOptions;
  notiContents?: Array<InotiContents>;
  createUser: () => boolean;
  addFeedCount: () => boolean;
  findUserName: () => IUser;
  findUserId: () => IUser;
  updateNoti: (newNotiContent: any) => boolean;
  findUserSuggest: () => ISearch;
  createFollow: (user: IFollow, target: IFollow) => boolean;
  deleteFollow: (user: IFollow, target: IFollow) => boolean;
  upsertNoti: (data: any) => any;
}

export default mongoose.model<IUser>('User', userSchema);
