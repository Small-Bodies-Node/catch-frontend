// import { Injectable } from '@angular/core';
// import { Store } from '@ngrx/store';
// import {
//   Observable,
//   of,
//   delay,
//   switchMap,
//   map,
//   catchError,
//   from,
//   concatAll,
//   concatMap,
//   Subscription,
// } from 'rxjs';

// import { IApiDataService } from '../../../../models/IApiDataService';
// import { IApiServiceStream } from '../../../../models/IApiServiceStream';
// import { TJobStreamResult } from '../../../../models/TJobStreamResult';
// import { IAppState } from '../../../ngrx/reducers';
// import { mockStreamMessages } from '../../../../utils/mockStreamMessages';
// import { ApiDataAction_SetStatus } from '../../../ngrx/actions/api-data.actions';
// import { apiMockResultMoving } from '../../../../utils/apiMockResultMoving';
// import { ISearchParamsMoving } from '../../../../models/ISearchParamsMoving';
// import { ISearchParamsFixed } from '../../../../models/ISearchParamsFixed';
// import { TWrappedApiDataResultOrError } from '../../../../models/TApiDataResultOrError';
// import { TApiDataCatchResultOrError } from '../../../../models/TApiDataCatchResultOrError';

// const mockTime1 = 0;
// const mockTime2 = 0;

// @Injectable({
//   providedIn: 'root',
// })
// export class ApiDataMockService implements IApiDataService {
//   // --->>>

//   constructor(private store$: Store<IAppState>) {}

//   fetchApiDataMoving(
//     searchParamsMoving: ISearchParamsMoving
//   ): Observable<TWrappedApiDataResultOrError> {
//     // --->>

//     const { target } = searchParamsMoving;

//     if (!target) {
//       return of({
//         status: 'error',
//         message: 'You must provide a target',
//         jobId: 'N/A',
//       });
//     }

//     return this.launchCatchJob(searchParamsMoving).pipe(
//       switchMap((apiCatchResultOrError) => {
//         // --->>

//         const { status } = apiCatchResultOrError;
//         if (status === 'error') {
//           throw new Error(apiCatchResultOrError.message);
//         }
//         const { apiDataCatchResult } = apiCatchResultOrError;
//         const { job_id, queued } = apiDataCatchResult;

//         if (!queued) {
//           return this.apiCaughtRequest(job_id).pipe(
//             map((wrappedApiDataResultOrError): TWrappedApiDataResultOrError => {
//               const { status } = wrappedApiDataResultOrError;
//               if (status === 'error') {
//                 throw new Error(wrappedApiDataResultOrError.message);
//               }
//               const { apiDataResult } = wrappedApiDataResultOrError;
//               return {
//                 apiDataResult,
//                 status: 'success',
//               };
//             }),
//             catchError((e: Error): Observable<TWrappedApiDataResultOrError> => {
//               return of({
//                 status: 'error',
//                 message: e.message,
//                 jobId: job_id,
//               });
//             })
//           );
//         }

//         // Else, listen to SSE stream and then grab data
//         return from(this.watchJobStream(job_id, searchParamsMoving)).pipe(
//           switchMap((jobStreamResult) => {
//             // --->>

//             if (jobStreamResult.status === 'error') {
//               throw new Error(jobStreamResult.message);
//             }

//             return this.apiCaughtRequest(job_id).pipe(
//               map(
//                 (wrappedApiDataResultOrError): TWrappedApiDataResultOrError => {
//                   const { status } = wrappedApiDataResultOrError;
//                   if (status === 'error') {
//                     throw new Error(wrappedApiDataResultOrError.message);
//                   }
//                   const { apiDataResult, job_id } = wrappedApiDataResultOrError;
//                   return {
//                     apiDataResult,
//                     job_id: job_id,
//                     status: 'success',
//                   };
//                 }
//               ),
//               catchError(
//                 (e: Error): Observable<TWrappedApiDataResultOrError> => {
//                   return of({
//                     status: 'error',
//                     message: e.message,
//                     jobId: job_id,
//                   });
//                 }
//               )
//             );
//           }),
//           catchError((e: Error): Observable<TWrappedApiDataResultOrError> => {
//             return of({
//               status: 'error',
//               message: e.message,
//               jobId: job_id,
//             });
//           })
//         );
//       }),
//       catchError((e: Error): Observable<TWrappedApiDataResultOrError> => {
//         return of({
//           status: 'error',
//           message: e.message,
//           jobId: 'N/A',
//         });
//       })
//     );
//   }

//   fetchApiDataFixed(
//     input: ISearchParamsFixed
//   ): Observable<TWrappedApiDataResultOrError> {
//     console.log('<< FETCHING MOCK DATA >>', input);
//     return of({
//       status: 'success',
//       apiFixedResult: apiMockResultMoving,
//     } as any).pipe(delay(1000));
//   }

//   launchCatchJob(
//     input: ISearchParamsMoving
//   ): Observable<TApiDataCatchResultOrError> {
//     // --->>

//     const {
//       target,
//       cached,
//       uncertainty_ellipse,
//       padding,
//       sources,
//       start_date,
//       stop_date,
//     } = input;

//     const result = of<TApiDataCatchResultOrError>({
//       status: 'success',
//       apiDataCatchResult: {
//         job_id: 'e8c4f483ffd34552a58a315f8a65ef92',
//         message: 'Job has been queued',
//         queued: cached,
//         query: {
//           cached,
//           padding,
//           sources,
//           target,
//           uncertainty_ellipse,
//           start_date,
//           stop_date,
//           type: 'COMET',
//         },
//         results:
//           'http://catch-dev-api.astro.umd.edu/caught/df37287908274e878751088e5aa55822',
//         version: '3.0rc2',
//       },
//     } as TApiDataCatchResultOrError);
//     return result;
//   }

//   apiCaughtRequest(jobId: string): Observable<TWrappedApiDataResultOrError> {
//     // --->>

//     console.log(' << MOCK CAUGHT REQUEST >> ');
//     return of({
//       status: 'success' as const,
//       message: 'Job has been completed',
//       job_id: 'e8c4f483ffd34552a58a315f8a65ef92',
//       apiDataResult: {
//         count: 10,
//         job_id: jobId,
//         data: apiMockResultMoving.data
//           .filter((_, ind) => {
//             // return true;
//             return [
//               'neat_palomar_tricam',
//               'neat_maui_geodss',
//               'skymapper_dr4',
//               'ps1dr2',
//               'catalina_bigelow',
//               'catalina_lemmon',
//               'catalina_bokneosurvey',
//               'spacewatch',
//               'loneos',
//               'atlas_haleakela',
//               'atlas_mauna_loa',
//               'atlas_rio_hurtado',
//               'atlas_sutherland',
//             ].includes(_.source);
//           })
//           .filter((_, ind) => ind < 10000000),
//         // .filter((_, ind) => _.source.includes('catalina')),
//         parameters: {
//           cached: false,
//           padding: 0,
//           sources: ['neat_palomar_tricam', 'neat_maui_geodss'] as any,
//           target: 'ZTF18abvkwla',
//           type: 'COMET',
//           uncertainty_ellipse: false,
//           start_date: '2018-01-01',
//           stop_date: '2021-01-01',
//         },
//         version: '3.0rc2',
//         status: [],
//       },
//     }).pipe(delay(mockTime1));
//   }

//   watchJobStream(
//     jobId: string,
//     searchParamsMoving: ISearchParamsMoving
//   ): Promise<TJobStreamResult> {
//     // --->>

//     const store$ = this.store$;
//     let subscription: Subscription;

//     return new Promise<TJobStreamResult>((resolve, reject) => {
//       // --->>

//       subscription = of<IApiServiceStream[]>(mockStreamMessages)
//         .pipe(
//           concatAll(), // flatten the array into individual next notifications
//           concatMap((message) => of(message).pipe(delay(mockTime2)))
//         )
//         .subscribe(({ job_prefix, status, text }) => {
//           console.log('>>>>>', job_prefix, status, text);
//           store$.dispatch(
//             ApiDataAction_SetStatus({
//               message: text,
//               code: 'searching',
//               search: {
//                 searchType: 'moving',
//                 searchParams: searchParamsMoving,
//               },
//             })
//           );

//           if (status === 'success') {
//             resolve({ job_id: jobId, status });
//             subscription.unsubscribe();
//           }
//         });
//     });
//   }
// }
