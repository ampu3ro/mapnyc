const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    address: String,
    type: String,
    environments: {
      type: [String],
      default: undefined,
    },
    enviroDetails: {
      type: [String],
      default: undefined,
    },
    indoorFloors: {
      type: [String],
      default: undefined,
    },
    orgType: String,
    headquarters: String,
    bCorp: Boolean,
    website: String,
    socials: String,
    area: Number,
    areaCellar: Number,
    areaGround: Number,
    areaFloor1: Number,
    areaFloor2: Number,
    areaOther: Number,
    areaRoof: Number,
    percentFood: Number,
    priorities: {
      type: [String],
      default: undefined,
    },
    accessibility: String,
    adModes: {
      type: [String],
      default: undefined,
    },
    growMethods: {
      type: [String],
      default: undefined,
    },
    aquaType: String,
    ponicType: String,
    iotTypes: {
      type: [String],
      default: undefined,
    },
    usdaOrganic: String,
    compost: String,
    compostOffsite: String,
    compostOnsite: String,
    dischargeMethods: {
      type: [String],
      default: undefined,
    },
    dischargePermit: String,
    cropSalad: Number,
    cropMicrogreens: Number,
    cropLeafy: Number,
    cropHerbs: Number,
    cropVine: Number,
    cropRoot: Number,
    cropCruciferous: Number,
    cropStarch: Number,
    cropGourds: Number,
    cropFunghi: Number,
    cropMelons: Number,
    cropBerries: Number,
    cropFruits: Number,
    cropNuts: Number,
    cropEggs: Number,
    cropChicken: Number,
    cropLivestock: Number,
    cropFish: Number,
    cropInsects: Number,
    cropMicroalgae: Number,
    cropStarts: Number,
    cropOrnamentals: Number,
    cropCannabis: Number,
    cropOther: Number,
    distroBox: Number,
    distroCorner: Number,
    distroSuper: Number,
    distroRestaurant: Number,
    distroWeb: Number,
    distroCSA: Number,
    distroMarket: Number,
    distroOnsite: Number,
    distroDonation: Number,
    distroHub: Number,
    distroPersonal: Number,
    distroOther: Number,
    distroRegion: String,
    founding: Number,
    ownership: String,
    zoning: String,
    leaseStart: Date,
    leaseEnd: Date,
    rent: Number,
    landValue: Number,
    employees: String,
    farmHand: String,
    farmManager: String,
    opsManager: String,
    eventsManager: String,
    partTime: String,
    volunteers: String,
    volunteerHours: String,
    localWorkers: String,
    studentPrograms: {
      type: [String],
      default: undefined,
    },
    skillsPrograms: {
      type: [String],
      default: undefined,
    },
    outreachHours: Number,
    incomeSources: {
      type: [String],
      default: undefined,
    },
    capInvestments: {
      type: [String],
      default: undefined,
    },
    renewableEnergy: String,
    authUsers: {
      type: [String],
      default: undefined,
    },
    modifiedBy: String,
    needsApproval: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model('farm', farmSchema);

module.exports = Farm;
