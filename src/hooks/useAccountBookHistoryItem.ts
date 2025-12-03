import {useCallback} from 'react';
import {AccountBookHistory} from '../data/AccountBookHistory';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
SQLite.DEBUG(true);

// export const useAccountBookHistoryItem = () => {
//   const openDB = useCallback<() => Promise<SQLiteDatabase>>(async () => {
//     return await SQLite.openDatabase(
//       {
//         name: 'account_history',
//         createFromLocation: '~www/account_history.db',
//         location: 'default',
//       },
//       () => {
//         console.log('open success');
//       },
//       () => {
//         console.log('open failure');
//       },
//     );
//   }, []);

//   return {
//     insertItem: useCallback<
//       (item: Omit<AccountBookHistory, 'id'>) => Promise<AccountBookHistory>
//     >(
//       async item => {
//         const db = await openDB();

//         // return;
//         const now = new Date().getTime();

//         // const ifResult = await db.executeSql(
//         //   'CREATE TABLE IF NOT EXISTS account_history (type, price, comment, date, photo_url, created_at, updated_at)',
//         // );

//         // console.log('Table is created.', ifResult);

//         const result = await db.executeSql(
//           `
// 				  INSERT INTO account_history (type, price, comment, date, photo_url, created_at, updated_at)
// 				  VALUES (
// 					  "${item.type}",
// 					  ${item.price},
// 					  "${item.comment}",
// 					  ${item.date},
// 					  ${item.photoUrl !== null ? `"${item.photoUrl}"` : null},
// 					  ${now},
// 					  ${now}
// 				  )
// 			  `,
//         );

//         console.log('result : ', result);

//         return {
//           ...item,
//           id: result[0].insertId,
//         };
//       },
//       [openDB],
//     ),

//     getList: useCallback<() => Promise<AccountBookHistory[]>>(async () => {
//       const db = await openDB();
//       const result = await db.executeSql('SELECT * FROM account_history');

//       const items: AccountBookHistory[] = [];
//       const size = result[0].rows.length;

//       for (let i = 0; i < size; i++) {
//         const item = result[0].rows.item(i);

//         items.push({
//           type: item.type,
//           comment: item.comment,
//           createdAt: parseInt(item.created_at),
//           updatedAt: parseInt(item.updated_at),
//           date: parseInt(item.date),
//           id: parseInt(item.id),
//           photoUrl: item.photo_url,
//           price: parseInt(item.price),
//         });
//       }

//       // 날짜순으로 정렬
//       return items.sort((a, b) => a.date - b.date);
//     }, [openDB]),

//     updateItem: useCallback<
//       (item: AccountBookHistory) => Promise<AccountBookHistory>
//     >(
//       async item => {
//         if (typeof item.id === 'undefined') {
//           throw Error('unexpected id value');
//         }
//         const db = await openDB();
//         const now = new Date().getTime();

//         const result = await db.executeSql(`
// 		UPDATE account_history
// 		SET price=${item.price},
// 		comment="${item.comment}",
// 		date=${item.date},
// 		photo_url=${item.photoUrl !== null ? `"${item.photoUrl}"` : null},
// 		updated_at=${now},
// 		date=${item.date}
// 		WHERE id=${item.id}
// 		`);

//         return {
//           ...item,
//           id: result[0].insertId,
//         };
//       },
//       [openDB],
//     ),
//   };
// };
export const useAccountBookHistoryItem = () => {
  const openDB = useCallback<() => Promise<SQLiteDatabase>>(async () => {
    const db = await SQLite.openDatabase(
      {
        name: 'account_history',
        createFromLocation: '~www/account_history.db',
        // createFromLocation: 1,
        location: 'default',
      },
      () => {
        console.log('open success');
      },
      () => {
        console.log('open failure');
      },
    );

    // 테이블이 없으면 생성 (최초 1회)
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS account_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        price INTEGER,
        comment TEXT,
        date INTEGER,
        photo_url TEXT,
        created_at INTEGER,
        updated_at INTEGER
      )
    `);

    return db;
  }, []);
  return {
    insertItem: useCallback<
      (item: Omit<AccountBookHistory, 'id'>) => Promise<AccountBookHistory>
    >(
      async item => {
        const db = await openDB();
        const now = new Date().getTime();

        const result = await db.executeSql(
          `
				  INSERT INTO account_history (type, price, comment,date, photo_url, created_at, updated_at)
				  VALUES ( 
					  "${item.type}",
					  ${item.price},
					  "${item.comment}",
					  ${item.date},
					  ${item.photoUrl !== null ? `"${item.photoUrl}"` : null},
					  ${now},
					  ${now}
				  )
			  `,
        );

        console.log(result);

        return {
          ...item,
          id: result[0].insertId,
        };
      },
      [openDB],
    ),
    getList: useCallback<() => Promise<AccountBookHistory[]>>(async () => {
      const db = await openDB();
      const result = await db.executeSql('SELECT * FROM account_history');
      const items: AccountBookHistory[] = [];
      const size = result[0].rows.length;

      for (let i = 0; i < size; i++) {
        const item = result[0].rows.item(i);

        items.push({
          type: item.type,
          comment: item.comment,
          createdAt: parseInt(item.created_at),
          updatedAt: parseInt(item.updated_at),
          date: parseInt(item.date),
          id: parseInt(item.id),
          photoUrl: item.photo_url,
          price: parseInt(item.price),
        });
      }

      return items.sort((a, b) => a.date - b.date);
    }, [openDB]),
    updateItem: useCallback<
      (item: AccountBookHistory) => Promise<AccountBookHistory>
    >(
      async item => {
        if (typeof item.id === 'undefined') {
          throw Error('unexpected id value');
        }

        const db = await openDB();

        const now = new Date().getTime();

        const result = await db.executeSql(
          `
			  UPDATE account_history
			  SET price=${item.price},
				  comment="${item.comment}",
				  date=${item.date},
				  photo_url=${item.photoUrl !== null ? `"${item.photoUrl}"` : null},
				  updated_at=${now},
				  date=${item.date}
			  WHERE id=${item.id}
		  `,
        );

        return {
          ...item,
          id: result[0].insertId,
        };
      },
      [openDB],
    ),
  };
};
