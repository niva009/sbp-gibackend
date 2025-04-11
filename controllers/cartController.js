
const Event = require('../models/EventSchema');
const Cart = require('../models/CartSchema');



const addtoCart  = async (req, res) => {

    try {
        const { userId } = req.user;
        const { eventId, quantity } = req.body;

        console.log("userId", userId);
        console.log("eventId", eventId);

      const eventDetails =  await Event.findById(eventId).select('title tickets.name tickets.price tickets.sale_price tickets.quantity tickets.currency organizer.name');

      console.log("eventDetails", eventDetails);

        if (!eventDetails) {
            return res.status(404).json({ message: "Event not found", success: false });
        }

        const duplicateCart = await Cart.findOne({
            user_id: userId,
            "items.event_id": eventId
        });
        if (duplicateCart) {
            return res.status(400).json({ message: "Event already in cart", success: false });
        }

        const ticket = eventDetails.tickets; 

        if (!ticket || ticket.quantity === 0) {
            return res.status(400).json({ message: "Tickets are sold out", success: false });
        }

        const discount = ticket.sale_price ? (ticket.price - ticket.sale_price) : 0;
        const subtotal = ticket.sale_price * quantity;
        const totalPrice = subtotal; 

        const cartData = {
            user_id: userId,
            items: [
                {
                    event_id: eventId,
                    event_name: eventDetails.title,
                    ticket_name: ticket.name,
                    price: ticket.price,
                    sale_price: ticket.sale_price,
                    currency: ticket.currency,
                    organser_name: eventDetails.organizer.name,
                    quantity: quantity,
                    subtotal: subtotal,
                }
            ],
            total_price: totalPrice,
            totalDiscount: discount * quantity,
            currency: ticket.currency,
        };

        const cartSave = await Cart.create(cartData);

        return res.status(200).json({
            message: "Added to cart successfully",
            success: true,
            data: cartSave
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false, error });
    }
}

const getCartItems = async (req, res) => {
    try {
        const { userId } = req.user;

        const cartItems = await Cart.findOne({ user_id: userId });

        if (!cartItems) {
            return res.status(404).json({ message: "No cart items found", success: false });
        }

        return res.status(200).json({
            message: "Cart items retrieved successfully",
            success: true,
            data: cartItems
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false, error });
    }
}

const removeFromCart = async (req, res) =>{

    try {
        const id = req.params.id;
        const { userId } = req.user;    
        const cart = await Cart.findByIdAndDelete({ _id: id });

        if (!cart) {
            return res.status(404).json({ message: "Cart item not found", success: false });
        }
        return res.status(200).json({ message: "Cart item removed successfully", success: true });  
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false, error });   
}
}
module.exports = {
    addtoCart,
    getCartItems,
    removeFromCart
}