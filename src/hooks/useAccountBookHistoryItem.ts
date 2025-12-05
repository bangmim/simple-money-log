import {useCallback} from 'react';
import {AccountBookHistory} from '../data/AccountBookHistory';
import {supabase} from '../config/supabase';
import {useAuth} from './useAuth';

export const useAccountBookHistoryItem = () => {
  const {user} = useAuth();
  return {
    insertItem: useCallback<
      (item: Omit<AccountBookHistory, 'id'>) => Promise<AccountBookHistory>
    >(
      async item => {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        const now = new Date().getTime();
        const dateValue = item.date !== 0 ? item.date : now;

        const {data, error} = await supabase
          .from('account_history')
          .insert({
            user_id: user.id,
            type: item.type,
            price: item.price,
            comment: item.comment,
            date: dateValue,
            photo_url: item.photoUrl,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return {
          id: data.id,
          type: data.type as '사용' | '수입',
          price: data.price,
          comment: data.comment,
          date: data.date,
          photoUrl: data.photo_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      },
      [user],
    ),
    getList: useCallback<() => Promise<AccountBookHistory[]>>(async () => {
      if (!user?.id) {
        return [];
      }

      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const {data, error} = await supabase
        .from('account_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {ascending: false});

      if (error) {
        console.error('Error fetching account history:', error);
        return [];
      }

      if (!data) {
        return [];
      }

      return data.map((item: AccountBookHistory) => ({
        id: item.id,
        type: item.type,
        price: item.price,
        comment: item.comment,
        date: item.date !== 0 ? item.date : item.createdAt,
        photoUrl: item.photoUrl,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    }, [user]),
    updateItem: useCallback<
      (item: AccountBookHistory) => Promise<AccountBookHistory>
    >(
      async item => {
        if (typeof item.id === 'undefined') {
          throw new Error('unexpected id value');
        }

        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        const now = new Date().getTime();

        const {data, error} = await supabase
          .from('account_history')
          .update({
            price: item.price,
            comment: item.comment,
            date: item.date,
            photo_url: item.photoUrl,
            updated_at: now,
          })
          .eq('id', item.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        return {
          id: data.id,
          type: data.type as '사용' | '수입',
          price: data.price,
          comment: data.comment,
          date: data.date,
          photoUrl: data.photo_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      },
      [user],
    ),
    deleteItem: useCallback<(id: number) => Promise<void>>(
      async id => {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }

        if (!supabase) {
          throw new Error('Supabase not configured');
        }

        const {error} = await supabase
          .from('account_history')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          throw new Error(error.message);
        }
      },
      [user],
    ),
  };
};
