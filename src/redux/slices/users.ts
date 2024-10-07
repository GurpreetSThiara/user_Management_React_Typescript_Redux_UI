import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: null,
    meta:null
}

const usersStore = createSlice({
    name:"users",
    initialState:initialState,
    reducers:{
        setUsers:(state, actions)=>{
            const {meta , users} = actions.payload;
            console.log("in redux" + users)
            state.users = users;
            state.meta = meta;
        }
        
    }
})

export const {setUsers} = usersStore.actions

export default usersStore