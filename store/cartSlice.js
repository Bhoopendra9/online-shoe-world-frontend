import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    addTocart: (state, action) => {
      const Item = state.cartItems.find((p) => p.id === action.payload.id);
      if (Item) {
        Item.quantity++;
        Item.attributes.price = Item.oneQuantityprice * Item.quantity;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    updatecart: (state, action) => {
      state.cartItems = state.cartItems.map((p) => {
        if (p.id === action.payload.id) {
          if (action.payload.key === "quantity") {
            p.attributes.price = p.oneQuantityprice * action.payload.val;
          }
          return { ...p, [action.payload.key]: action.payload.val };
        }
        return p;
      });
    },

    removeitemfromcart: (state, action)=>{
      state.cartItems = state.cartItems.filter((p)=>(
        p.id !== action.payload.id
      ))
    }
  },
});

// Action creators are generated for each case reducer function
export const { addTocart, updatecart, removeitemfromcart } = cartSlice.actions;

export default cartSlice.reducer;
