import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("ladyitem_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  const [discountCode, setDiscountCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ladyitem_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const pId = product.productId || product._id;

    const existingItem = cart.find(
      (item) => (item.productId || item._id) === pId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;

      setCart((prevCart) =>
        prevCart.map((item) => {
          if ((item.productId || item._id) === pId) {
            return {
              ...item,
              quantity: newQty,
            };
          }

          return item;
        })
      );

      toast.success(
        `Updated ${product.name} quantity to ${newQty} in cart`
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        {
          ...product,
          quantity,
        },
      ]);

      toast.success(`Added ${product.name} to cart!`);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const itemToRemove = cart.find(
      (item) => (item.productId || item._id) === productId
    );

    setCart((prevCart) =>
      prevCart.filter(
        (item) => (item.productId || item._id) !== productId
      )
    );

    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.name} from cart`);
    }
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) => {
        if ((item.productId || item._id) === productId) {
          return {
            ...item,
            quantity,
          };
        }

        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setDiscountCode("");
    setDiscountPercentage(0);

    toast.success("Cart cleared");
  };

  // Apply promo code
  const applyPromoCode = (code) => {
    const trimmed = code.trim().toUpperCase();

    if (!trimmed) {
      return false;
    }

    if (trimmed === "LADY10" || trimmed === "WELCOME10") {
      setDiscountCode(trimmed);
      setDiscountPercentage(10);

      toast.success("Promo code applied! 10% discount added.");

      return true;
    }

    if (trimmed === "LADY20") {
      setDiscountCode(trimmed);
      setDiscountPercentage(20);

      toast.success("Promo code applied! 20% discount added.");

      return true;
    }

    toast.error("Invalid promo code");

    return false;
  };

  // Remove promo code
  const removePromoCode = () => {
    setDiscountCode("");
    setDiscountPercentage(0);

    toast.success("Promo code removed");
  };

  // Calculated values
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = item.quantity || 1;

    return total + price * quantity;
  }, 0);

  const discountAmount =
    (subtotal * discountPercentage) / 100;

  const shippingFee =
    subtotal > 0
      ? subtotal > 5000
        ? 0
        : 350
      : 0;

  const grandTotal = Math.max(
    0,
    subtotal - discountAmount + shippingFee
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discountCode,
        discountPercentage,
        discountAmount,
        shippingFee,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
}