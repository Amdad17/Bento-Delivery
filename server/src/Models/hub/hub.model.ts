import { Schema, model } from 'mongoose';

import { IHub } from '../../interfaces/IHub';
// import { IRider } from '../../Interfaces/IRider';

// const riderSchema = new Schema<IRider>({

// })

const hubSchema = new Schema<IHub>({
  //   _id: {
  //     type: String,
  //     required: true,
  //   },
  capacity: {
    type: Number,
    required: true,
  },
  riders: {
    type: [Object],
  },
  restaurants: {
    type: [Object],
  },
  center: {
    type: [Number],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Hub = model<IHub>('hub', hubSchema);

export default Hub;
