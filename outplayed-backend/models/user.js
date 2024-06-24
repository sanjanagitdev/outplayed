import mongoose from 'mongoose';
const regexForEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [regexForEmail, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    steamid: {
      type: String,
    },
    useravatar: {
      type: String,
    },
    loginviasteam: {
      type: Boolean,
      default: false,
    },
    profileurl: {
      type: String,
    },
    forgetPassHash: {
      type: String,
    },
    forgetPassCreatedAt: {
      type: String,
    },
    prestige: {
      type: Number,
      default: 1000,
    },
    prestige1vs1: {
      type: Number,
      default: 1000,
    },
    ispremium: {
      type: Boolean,
      default: false,
    },
    ispremiumadvnaced: {
      type: Boolean,
      default: false,
    },
    penalty: {
      type: Date,
    },
    monthlyhubpoint: {
      type: Number,
      default: 1000,
    },
    sentRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    receivedRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'friends',
      },
    ],
    online: {
      type: Boolean,
      default: false,
    },
    notification: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notification',
      },
    ],
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'group',
    },
    invitedfriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    coins: {
      type: Number,
      default: 0,
    },
    invitedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    old1vs1stats: {
      type: mongoose.Schema.Types.Mixed,
    },
    tournamentCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tournament',
      },
    ],
    postedtickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tickets',
      },
    ],
    laddersCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ladders',
      },
    ],
    laddersChallenges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ladderchallenge',
      },
    ],
    points: {
      type: Number,
      default: 0,
    },
    paymentInfo: {
      type: Object,
      default: {},
    },
    onsiteWallet: {
      type: Number,
      default: 0,
    },
    transaction: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
      },
    ],
    paypalAccount: {
      type: String,
    },
    withdrawRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'withdraw',
      },
    ],
    banuntil: {
      type: Date,
    },
    plan: {
      type: String,
    },
    membership_tokenid: [
      {
        type: String,
      },
    ],
    subscription_data: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    pruches_item: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pruchesitem',
      },
    ],
    isturnament: {
      type: Boolean,
      default: false,
    },
    isladders: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    followingCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    signatureBook: [
      {
        userid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        message: {
          type: String,
        },
        signatureAt: {
          type: Date,
        },
      },
    ],
    dob: {
      type: Date,
    },
    nationality: {
      type: String,
    },
    nickname: {
      type: String,
    },
    mainteam: {
      type: String,
    },
  },
  { timestamps: { createdAt: 'joined_at' } }
);
userSchema.path('email').validate(async (email) => {
  const countUser = await mongoose.models.users.countDocuments({ email });
  return !countUser;
}, 'Email Already exist');

const userModel = mongoose.model('users', userSchema);
export default userModel;
