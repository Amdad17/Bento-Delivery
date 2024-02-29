// import { Request, Response } from 'express';

// import { IRestaurantLonLatData } from '../Interfaces/IRestaurantLonLatData';
// import { IRestaurantUtilizationData } from '../Interfaces/IRestaurantUtilizationData';
// import { IUtilizationData } from '../Interfaces/IUtilizationData';

// type utilizationDataReqBody = {
//   utilizations: IRestaurantUtilizationData[];
//   coordinates: IRestaurantLonLatData[];
// };

// export const utilizationDataController = (req: Request, res: Response) => {
//   try {
//     const { utilizations } = req.body as utilizationDataReqBody;
//     const { coordinates } = req.body as utilizationDataReqBody;
//     const newArr: IUtilizationData[] = [];
//     for (let i = 0; i < utilizations.length; i++) {
//       const lon_lat: number[] =
//         coordinates[
//           coordinates
//             .map(function (x) {
//               return x.restaurantId;
//             })
//             .indexOf(utilizations[i].restaurantId)
//         ].coordinates;
//       newArr.push({
//         ...utilizations[i],
//         coordinates: lon_lat,
//         utilizationType:
//           utilizations[i].utilizationRate > 75
//             ? 'HU'
//             : utilizations[i].utilizationRate > 50 && utilizations[i].utilizationRate <= 75
//               ? 'MU'
//               : 'LU',
//       });
//     }
//     res.status(201).json(newArr);
//   } catch (error) {
//     res.status(500);
//     if (error instanceof Error) res.json({ message: error.message });
//   }
// };
