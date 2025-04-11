
const EventSchema = require("../models/EventSchema"); 
const Category = require("../models/CategorySchema");

const createEventInformation = async (req, res) => {
    try {
        const { title, description, category_id, tags, start_date, end_date, timezone } = req.body;

        if (!title || !description || !category_id  || !start_date || !end_date || !timezone) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const categoryInfo = await Category.findById(category_id);

        const newEvent = new EventSchema({
            title,
            description,
            category_id,
            category:categoryInfo.name,
            tags,
            start_date,
            end_date,
            timezone,
            status: "draft" 
        });

        await newEvent.save();
        res.status(200).json({ message: "Event created successfully", eventId: newEvent._id, success: true,event:newEvent });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// for updaate location details//

const updateEventLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            venue_name,
            address,
            city,
            state,
            country,
            postal_code,
            is_virtual,
            virtual_link
        } = req.body; 

        // Validate if required fields are present
        if (!venue_name || !address || !city || !country) {
            return res.status(400).json({ 
                message: "Missing required location fields", 
                success: false 
            });
        }
        const parsedIsVirtual = is_virtual === "true" || is_virtual === true;

        // Construct location object
        const locationData = {
            venue_name,
            address,
            city,
            state,
            country,
            postal_code,
            is_virtual: parsedIsVirtual,
            virtual_link
        };


        console.log("event id", id);
     

        // Update only the location field in the event document
        const updatedEvent = await EventSchema.findByIdAndUpdate(
            id,
            { $set: { location: locationData } }, // ✅ Ensures only location is updated
            { new: true, runValidators: true } // ✅ Returns updated event & applies validation
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", success: false });
        }

        res.status(200).json({ message: "Location updated successfully", success: true, event: updatedEvent });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


//for updaating organsier inforation//


const updateOrganiser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, website, about } = req.body;
        const organiser_logo = req.file ? `${req.file.filename}` : undefined;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                message: "Organizer name and email are required",
                success: false
            });
        }

        // Construct organizer object
        const organizerData = { name, email, phone, website, organiser_logo, about };

        // Update only the organizer field
        const updatedEvent = await EventSchema.findByIdAndUpdate(
            id,
            { $set: { organizer: organizerData } },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", success: false });
        }

        res.status(200).json({ message: "Organizer updated successfully", success: true, event: updatedEvent });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


//guest inforamtion updaatee////


const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        let { guests } = req.body;

        // Ensure guests is parsed correctly
        if (typeof guests === "string") {
            guests = JSON.parse(guests); // ✅ Convert stringified JSON to object
        }

        if (!Array.isArray(guests) || guests.length === 0) {
            return res.status(400).json({ message: "Guests should be a non-empty array", success: false });
        }

        // Proceed with updating the database
        const updatedEvent = await EventSchema.findByIdAndUpdate(
            id,
            { $set: { guests } },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", success: false });
        }

        res.status(200).json({ message: "Guests updated successfully", success: true, event: updatedEvent });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


//update ticket inforation


const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { name,price,currency,quantity,sales_start_date,sales_end_date,sale_price } = req.body; 

        console.log("tickets inforamation", req.body);

    
   
            if (!name || !price || !currency || !quantity || !sales_start_date || !sale_price) {
                return res.status(400).json({
                    message: "Each ticket must have name, price, currency, quantity, and sales_start_date",
                    success: false
                });
            }

            const tickets ={
                name,
                price,
                quantity,
                currency,
                sale_price,
                sales_start_date,
                sales_end_date
            }


   
        const updatedEvent = await EventSchema.findByIdAndUpdate(
            id,
            { $set: { tickets: tickets } },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", success: false });
        }

        res.status(200).json({ message: "Tickets updated successfully", success: true, event: updatedEvent });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const publishEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { capacity, age_restriction } = req.body; 
        console.log("evnetint information",req.body);
        const event_banner = req.file ? `${req.file.filename}` : undefined;

        console.log("eventid..",id);

        // Find the event first
        let updatedEvent = await EventSchema.findById(id);
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found", success: false });
        }

        // Update event details
        updatedEvent.capacity = capacity || updatedEvent.capacity;
        updatedEvent.age_restriction = age_restriction || updatedEvent.age_restriction;

         if (event_banner) {
            updatedEvent.event_banner = event_banner;
        }
        
        // Change status to "published"
        updatedEvent.status = "published";

        // Save updated event
        await updatedEvent.save();

        res.status(200).json({ 
            message: "Event published successfully", 
            success: true, 
            event: updatedEvent 
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
        console.error("Error publishing event:", error);
    }
};


const getEvent = async(req,res) =>{

    try {
        const {id} = req.params

        const eventInformation = await EventSchema.findOne({_id:id})

        if(!eventInformation){
            return res.status(400).json({message:"event not found", success:false, error:true});
        }

        return res.status(200).json({message:"event found successfully",data:eventInformation,success:true})
    }catch(error){
        return res.status(500).json({message:"internal server errror", success:false, error:error})
    }
}

const showAllEvents = async (req, res) => {
    try {
        const events = await EventSchema.find({});
        res.status(200).json({ success: true, data:events });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

const deleteEvent = async (req, res) => {
    const id = req.params.id;
    console.log("event id", id);
    if (!id) {
        return res.status(400).json({ message: "Event ID is required", success: false });
    }
    try {
        const deletedEvent = await EventSchema.findByIdAndDelete({_id:id});
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found", success: false });
        }
        res.status(200).json({ message: "Event deleted successfully", success: true, data:deletedEvent });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {createEventInformation,updateEventLocation,updateOrganiser,updateEvent,updateTicket,publishEvent,getEvent,showAllEvents,
    deleteEvent
}






