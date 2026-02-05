import { useState } from 'react';

export const useUser = () => {
    const [name, setName] = useState(() => {
        return localStorage.getItem('user_profile_name') || 'User';
    });

    const updateName = (newName: string) => {
        setName(newName);
        localStorage.setItem('user_profile_name', newName);
    };

    return {
        name,
        setName: updateName
    };
};
