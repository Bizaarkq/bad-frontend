import React, {useContext, useState, useEffect} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const initialState = {
    items: [],
};
const CarritoContext = React.createContext(initialState);

export function CarritoProvider({children}) {
    const [cart, setCart] = useState(initialState);
    const [cartStore, setCartStore] = useLocalStorage("cart", {});

    useEffect(() => {
        setCartStore(cart);
    }, [cart]);

    // useEffect(() => {
    //     if(Object.keys(cartStore).length){
    //         setCart(cartStore);
    //     }
    // }, []);

    return (
        <CarritoContext.Provider value={{cart, setCart}}>
            {children}
        </CarritoContext.Provider>
    )
}


export const useCart = () => useContext(CarritoContext);
export default CarritoContext;