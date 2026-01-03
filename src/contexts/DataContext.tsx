import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { PostingService, SearchService } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
    postings: PostingService[];
    searches: SearchService[];
    loading: boolean;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [postings, setPostings] = useState<PostingService[]>([]);
    const [searches, setSearches] = useState<SearchService[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            let postingsQuery = supabase
                .from('posting_services')
                .select('*')
                .order('created_at', { ascending: false });

            let searchesQuery = supabase
                .from('search_services')
                .select('*')
                .order('created_at', { ascending: false });

            // If not admin, filter to show only approved items
            if (!user?.is_admin) {
                postingsQuery = postingsQuery.eq('status', 'approved');
                searchesQuery = searchesQuery.eq('status', 'approved');
            }

            const [postingsData, searchesData] = await Promise.all([
                postingsQuery,
                searchesQuery
            ]);

            if (postingsData.data) setPostings(postingsData.data);
            if (searchesData.data) setSearches(searchesData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]); // Refetch when user changes (e.g. login/logout)

    const refreshData = async () => {
        await fetchData();
    };

    return (
        <DataContext.Provider value={{ postings, searches, loading, refreshData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
