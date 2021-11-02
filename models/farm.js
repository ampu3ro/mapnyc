const mongoose = require('mongoose');
const { Schema } = mongoose;
const Location = require('./location');

const farmSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    locations: [Location.schema],
    type: String,
    environments: [String],
    enviroDetails: [String],
    indoorFloors: [String],
    orgType: String,
    bCorp: Boolean,
    area: Number,
    areaCellar: Number,
    areaGround: Number,
    areaFloor1: Number,
    areaFloor2: Number,
    areaOther: Number,
    areaRoof: Number,
    percentFood: Number,
    priorities: [String],
    accessibility: String,
    adModes: [String],
    growMethods: [String],
    aquaType: String,
    ponicType: String,
    waterType: String,
    iotTypes: [String],
    pestManagement: String,
    usdaOrganic: String,
    compost: String,
    compostOffsite: String,
    compostOnsite: String,
    dischargeMethods: [String],
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
    positions: [String],
    wages: [Number],
    employees: Number,
    volunteers: Number,
    volunteerHours: Number,
    outreachHours: Number,
    localWorkers: String,
    studentPrograms: [String],
    skillsPrograms: [String],
    authEmails: [String],
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