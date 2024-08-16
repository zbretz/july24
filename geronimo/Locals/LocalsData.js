const partnerData = {

    'Daily Rise': {
        blurb: 'Located inside of The Market, this is our favorite place in all of Park City to get a coffee.',
        hours: 'hours',
        cover_photo: require('../assets/dailyrise.jpeg'),
        menu: [
            {
                title: 'Espresso Drinks',
                data: [
                    { choice: 0, name: 'Latte', description: 'Espresso with steamed milk', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                    { choice: 0, name: 'Mocha', description: 'Espresso with steamed milk', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                ],
            },
            {
                title: 'Chai',
                data:
                    [
                        { choice: 0, name: 'Chai Latte', description: 'Chai tea with steamed milk', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 1, name: 'Chai Charger', description: 'Chai Latte with Espresso', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 2, name: 'Sugar Free Chai Latte', description: 'Chai - but sugar free!', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 3, name: 'Sugar Free Chai Charger', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 4, name: 'Mountain Chiller Chai Charger', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 5, name: 'Mountain Chiller Chai Latte', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                    ],
            },
            {
                title: 'Coffee, Cocoa, & Tea',
                data:
                    [
                        { choice: 0, name: 'Cold Brew', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 1, name: 'Drip Coffee', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 2, name: 'Hot Chocolate', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 3, name: 'Hot Tea', description: 'Varieties of Organic Rishi Tea', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 4, name: 'London Fog', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                        { choice: 5, name: 'Matcha', description: '', is_drink: true, price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                    ],
            },

        ],

    },

    'Nosh': {

        blurb: 'Great spot in Prospector (off Bonanza Drive) for Meditarranean food. The best of pita, falafels and more.',
        hours: 'hours',
        cover_photo: require('../assets/nosh.jpeg'),
        menu: [
            {
                title: 'Smalls',
                data: [
                    { choice: 0, name: 'Marinated Olives', description: "Roasted peppers, red onions, za'atar, citrus", is_drink: false, price: 4.00, },
                    { choice: 1, name: 'Potato Latkes', description: 'Apple jam, everything spice labneh', is_drink: false, price: 8.00, },
                    { choice: 2, name: 'Crispy Brussels', description: "Tahini, harissa honey, candied walnuts", is_drink: false, price: 9.00, },
                    { choice: 3, name: "Loaded Za'atar Fries", description: 'Israeli salad, feta, pickled onion', is_drink: false, price: 8.00, },
                    { choice: 4, name: 'Mediterranean Salad', description: 'Tomato, cucumber, red onion, roasted red peppers, olives, feta, herb vinaigrette', is_drink: false, price: 13.00, },
                    { choice: 5, name: 'Matzo Ball Soup', description: 'Herb roasted chicken, carrot, celery, onion, matzo balls.', is_drink: false, price: 9.00, },
                    { choice: 6, name: 'Classic Hummus', description: 'Crudite, pita, choice of toppings.', is_drink: false, price: 8.00, },
                    { choice: 7, name: 'Roasted Red Pepper Hummus', description: 'Crudité, pita, choice of topping.', is_drink: false, price: 8.00, },
                    { choice: 8, name: 'Babaganoush', description: 'Smoky eggplant dip, crispy eggplant, pickled onions, fresh herbs, crudité & pita.', is_drink: false, price: 11.00, },
                    { choice: 9, name: 'Muhammara', description: 'Roasted red pepper dip, spiced sweet potatoes, candied walnuts, parsley, crudité & pita', is_drink: false, price: 12.00, },
                    { choice: 10, name: 'Beets', description: 'House made labneh, dukkah, fresh herbs', is_drink: false, price: 8.00, },
                ],
            },
            {
                title: 'Signatures',
                data:
                    [
                        { choice: 0, name: 'Mezze Platter', description: 'Classic hummus, babaganoush, chickpea salad, roasted red peppers, marinated olives, feta cheese, house-made pickles, crudité, pita (2 pieces).', is_drink: false, price: 22.00, },
                        { choice: 1, name: 'Nosh Platter', description: 'CHOOSE: marinated chicken, braised lamb, beef kofta, vegetarian, or a combination. INCLUDES: classic hummus, herbed falafel, spiced rice, roasted vegetables, green salad, pickled cabbage slaw, pita, yogurt sauce & tahini.', is_drink: false, price: 30.00, },
                        { choice: 2, name: 'Chicken & Fawaffle', description: "Crispy marinated chicken, falafel waffle, red pepper hummus, pickled cabbage slaw, Israeli salad, za'atar honey, harissa yogurt.", is_drink: false, price: 22.00, },
                    ],
            },
            {
                title: 'Pitas',
                data:
                    [
                        { choice: 0, name: 'Lamb Pita', description: 'Classic hummus, greens, Israeli salad, pickled cabbage slaw, tahini, yogurt sauce.', is_drink: false, price: 16.00, },
                        { choice: 1, name: 'Falafel Pita', description: 'Classic hummus, greens, Israeli salad, pickled cabbage slaw, tahini, yogurt sauce.', is_drink: false, price: 13.00, },
                        { choice: 2, name: 'Beef Kofta Pita', description: 'Classic hummus, greens, Israeli salad, pickled cabbage slaw, tahini, yogurt sauce.', is_drink: false, price: 16.00, },
                        { choice: 3, name: 'Chicken Pita', description: 'Classic hummus, greens, Israeli salad, pickled cabbage slaw, tahini, yogurt sauce.', is_drink: false, price: 14.00, },
                        { choice: 4, name: 'Kids Pita', description: 'Choose: Herbed falafel, marinated chicken OR braised lamb INCLUDES: Classic hummus, yogurt sauce.', is_drink: false, price: 8.00, },
                    ],
            },
            {
                title: 'Bowls',
                data:
                    [
                        { choice: 0, name: 'Falafel Bowl', description: 'Classic hummus, chickpea salad, crispy brussels sprouts, pickled cabbage slaw, Israeli salad, yogurt sauce, tahini', is_drink: false, price: 15.00, },
                        { choice: 1, name: 'Roasted Veggie Bowl', description: 'Red pepper hummus, seasonal roasted vegetables, couscous tabouli, Israeli salad, pickled cabbage slaw, yogurt sauce, tahini. Vegetables are subject to change based on seasonality & availability.', price: 15.00, },
                        { choice: 2, name: 'Chicken Bowl', description: 'Classic hummus, spiced rice, sweet potato, pickled slaw, Israeli salad, harissa yogurt.', is_drink: false, price: 16.00, },
                        { choice: 3, name: 'Lamb Bowl', description: 'Shawarma spiced braised lamb shoulder, red pepper hummus, couscous tabouli, herb roasted vegetables, pickled slaw, Israeli salad, yogurt sauce. Vegetables are subject to change based on seasonality & availability.', price: 18.00, },
                        { choice: 4, name: 'Beef Kofta bowl', description: 'Spiced beef meatballs, muhammara, basmati rice, crispy brussels, pickled cabbage slaw, Israeli salad, yogurt sauce, tahini', price: 18.00, },
                        { choice: 5, name: 'Kids Bowl', description: 'Choose: Herbed falafel, marinated chicken OR braised lamb INCLUDES: Classic hummus, spiced rice, yogurt sauce', price: 9.00, },
                    ],
            },
            {
                title: 'Sides',
                data:
                    [
                        { choice: 0, name: 'Hummus & Pita', description: 'Classic hummus & pita', is_drink: false, price: 6.00, },
                        { choice: 1, name: 'Zaatar Fries', description: "Crispy battered fries, za'atar, harissa fry sauce", price: 5.00, },
                        { choice: 2, name: 'Side of Lamb', description: 'Braised Leg of Lamb.', is_drink: false, price: 7.00, },
                        { choice: 3, name: 'Side of Chicken', description: 'Braised Leg of Lamb.', is_drink: false, price: 7.00, },
                        { choice: 4, name: 'Side Fried Chicken', description: 'Red cabbage, carrots, fennel', price: 3.00, },
                        { choice: 5, name: 'Falafel Side', description: 'Classic hummus & pita', is_drink: false, price: 6.00, },
                        { choice: 6, name: 'Pickled Slaw', description: 'Red cabbage, carrots, fennel', price: 3.00, },
                        { choice: 7, name: 'House-Made Pickles', description: 'Variety of vegetables each pickled with different aromatics.', price: 4.00, },
                        { choice: 8, name: 'Side of Rice', description: '', price: 5.00, },
                        { choice: 9, name: 'Side of Roasted Veg', description: '', price: 5.00, },
                        { choice: 10, name: 'Chickpea Salad', description: "Crispy battered fries, za'atar, harissa fry sauce", price: 5.00, },
                        { choice: 11, name: 'Side Pita', description: 'Variety of vegetables each pickled with different aromatics.', price: 4.00, },
                        { choice: 12, name: 'Roasted Sweet Potato', description: '', price: 5.00, },
                    ],
            },
        ],
    },
    "Auntie Ems": {
        blurb: "The best bakery in Park City, hands down. Pies, cookies, and treats for all occasions.",
        hours: 'hours',
        cover_photo: require('../assets/auntie_cover.jpg'),
        menu: [
            {
                title: 'Cookies, Scones, & Banana Bread',
                data: [
                    { choice: 1, name: 'Individual Cookies', description: 'Chocolate Chip, Snickerdoodle, Coconut Macaroon, Triple Ginger Snaps, Oatmeal Cocunit Pecan Raisin, Vanilla Bean Sugar, Rice Krispie Treat!, Flourless Peanut Butter', is_drink: false, price: 3.59, },
                    { choice: 2, name: 'Scones', description: 'Mixed Bacon, Butternut Squash, Bacon Parmesan', is_drink: false, price: 3.59, },
                    { choice: 3, name: 'Banana Bread Slice', description: 'One slice of the loaf that puts "the banana" in banana bread.', is_drink: false, price: 3.59, },
                    { choice: 4, name: 'Banana Bread Loaf', description: 'The most banana-y bread you will ever try!', is_drink: false, price: 15.00, },
                ],
            },
            {
                title: 'Sweet Pies',
                data:
                    [
                        { choice: 1, name: 'Saucy Apple Crumble', description: "We have combined the best of both worlds to create one irresistible apple crumble pie. We've taken the sweet buttery sauce from Ralph's pie, poured it over crisp granny smith apples and topped it in our dreamy buttery crumble. The result is outstanding.", is_drink: false, menu_price: 33.00, },
                        { choice: 2, name: 'Blueberry', description: 'Juicy blueberries and tart lemon meld together in this double-pastry golden pie', is_drink: false, price: 33.00, },
                        { choice: 3, name: 'Lemon Curd w/ Whipped Cream Topping', description: 'Tart lemon filling topped with a light serving of freshly whipped cream. A more refreshing take on lemon meringue!', is_drink: false, price: 33.00, },
                        { choice: 4, name: 'Peach', description: 'Fresh juicy peaches, combined with lemon and vanilla make for a mouth-watering mid-summer treat!', is_drink: false, price: 33.00, },
                        { choice: 5, name: 'Peach-Berry', description: 'Peaches and berries prove to be the best of friends in this really good pie.', is_drink: false, price: 33.00, },
                        { choice: 6, name: 'Triple Berry Crumble', description: 'Raspberries, Blackberries and Blueberries are gently sweetened to this side of tart, and topped with a cakey shortbread crumble topping. My latest favorite pie, for sure.', is_drink: false, price: 33.00, },
                        { choice: 7, name: 'Maple-Bourbon-Pecan', description: "Forget about corn syrup, this one's sweetened with organic Vermont Maple Syrup and finished with our favorite bourbon!", is_drink: false, price: 33.00, },
                        { choice: 8, name: 'Blueberry', description: 'Juicy blueberries and tart lemon meld together in this double-pastry golden pie', is_drink: false, price: 33.00, },
                    ],
            },
            {
                title: 'Savory Pies',
                data:
                    [
                        { choice: 1, name: 'Chicken + Herb', description: 'We take our own spin on this classic comfort food. Fresh herbs, fresh veg, and organic chicken thighs are loaded into this savory pie.', is_drink: false, price: 38.00, },
                        { choice: 2, name: "Steak n' Ale", description: "First we sous vide beef, the slow cook it with local carrots and mushrooms in a heavenly sauce made with local brewery, Offset Beer. So good, we have a wait list.", is_drink: false, price: 38.00 },
                        { choice: 3, name: 'Green Chile Pork', description: "Slow cooked hand pulled pork simmered in a homemade green chili tomatillo sauce. Just when you thought it couldn't get any better, we finish it with cotija cheese.", is_drink: false, price: 38.00, },
                        { choice: 4, name: 'Vegetable Festival', description: "Local oyster mushrooms, butternut squash, kale, carrots, and more (!) harmonize in a parmesan cream sauce. A real festival of vegetables!", is_drink: false, price: 38.00, },
                    ],
            },
        ],
    },

    "Clockwork": {
        blurb: "KIMBALL LOCATION: Sandwiches, soups, and more. Clockwork focuses on fresh, quality ingredients and is our go-to spot for lunch.",
        hours: 'hours',
        cover_photo: require('../assets/Clockwork2.jpeg'),
        menu: [
            {
                title: 'Sandiwches',
                data: [
                    { choice: 0, name: 'Ellibee', description: 'Sourdough, Mayonnaise, Deli Mustard, Turkey, Ham, Jack, Tomato, Onion', is_drink: false, price: 13.99, },
                    { choice: 1, name: 'Chicken Bacon Ranch', description: 'French Roll, Ranch Dressing, Avocado, Tomato, Onion, Jalapeno, Chicken, Buffalo Sauce, Bacon, Jack', is_drink: false, price: 13.99, },
                    { choice: 2, name: 'Club', description: 'Sourdough, Mayonnaise, Deli Mustard, Chicken, Bacon, Cheddar, Tomato, Onion', is_drink: false, price: 13.99, },
                    { choice: 3, name: 'Crazy Chicken', description: 'Sourdough, Mayonnaise. Chicken Salad, Jack, Jalapeño, Tomato, Lettuce', is_drink: false, price: 13.99, },
                    { choice: 4, name: 'Chicken Bacon Ranch', description: 'French Roll, Ranch Dressing, Avocado, Tomato, Onion, Jalapeno, Chicken, Buffalo Sauce, Bacon, Jack', is_drink: false, price: 13.99, },
                    { choice: 5, name: 'Reuben', description: 'Rye Bread, 1000 Island, Pastrami, Provolone, Sauerkraut', is_drink: false, price: 13.99, },
                    { choice: 6, name: 'Paisano', description: 'Sourdough, Mayonnaise, Pesto, Chicken, Provolone, Tomato, Onion', is_drink: false, price: 13.99, },
                    { choice: 7, name: 'Mediterranean', description: 'Wheat, Oil and Vinegar, Hummus, Ranch, Turkey, Jack, Cucumber, Tomato, Onion', is_drink: false, price: 13.99, },
                    { choice: 8, name: 'Paisano 2.0', description: 'Sourdough, Oil and Vinegar, Pesto, Chicken, Parmesan, Provolone, Onion, Tomato', is_drink: false, price: 13.99, },
                    { choice: 9, name: 'Italian Stallion', description: 'French Roll, Ham, Salami, Provolone, Parmesan, Pepperoncini, Oil and Vinegar, Mayonnaise, Deli Mustard, Tomatoes, Onion', is_drink: false, price: 13.99, },
                    { choice: 10, name: 'Barbeque Chicken', description: 'Wheat, Mayonnaise, Barbeque Sauce, Chicken, Jack, Tomato, Onion, Jalapeno', is_drink: false, price: 13.99, },
                    { choice: 11, name: 'The Clockwork Croquet', description: 'Rye Bread, Ham, Provolone, Honey Mustard, Mayonnaise, Horseradish, Pepperoncini, Tomato, Onion', is_drink: false, price: 13.99, },
                    { choice: 12, name: "The Manager's Special", description: 'Sourdough, Mayonnaise, Deli Mustard, Horseradish, Pastrami, Jack, Tomato, Onion, Pepperoncini', is_drink: false, price: 13.99, },
                    { choice: 13, name: 'Veggie Mediterranean', description: 'Wheat, Oil & Vinegar, Hummus, Ranch, Avocado, Cucumber, Carrot, Tomato, Onion, Provolone, Mixed Greens', is_drink: false, price: 13.99, },
                    { choice: 14, name: 'Torta', description: 'Wheat, Mayonnaise, Cholula, Ham, Jack, Avocado, Tomato, Onion', is_drink: false, price: 13.99, },
                    { choice: 15, name: 'Power I', description: 'Sourdough, Mayonnaise, Chicken Salad, Ham, Bacon, Jack, Jalapeño, Lettuce, Tomato', is_drink: false, price: 13.99, },
                    { choice: 16, name: 'Veggie Paisano', description: 'Sourdough, Oil & Vinegar, Pesto, Avocado, Cucumber, Carrot, Tomato, Onion, Provolone, Parmesan, Mixed Greens', is_drink: false, price: 13.99, },
                ],
            },
            {
                title: 'Wraps',
                data:
                    [
                        { choice: 0, name: 'Southwestern Chicken Wrap', description: 'Ranch, Cholula, Mixed Greens, Tomato, Onion, Jalapeno, Turkey, Avocado, Shredded Cheese in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 1, name: 'Pacific Rim Wrap', description: 'Sesame Ginger Vinaigrette, Mixed Greens, Tomato, Onion, Cucumber, Carrot, Chicken, Craisins in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 2, name: 'Italian Wrap', description: 'Mayonnaise, Deli Mustard, Oil and Vinegar, Mixed Greens, Tomato, Onion, Pepperoncini, Ham, Salami, Provolone, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 3, name: 'Southwestern Chicken Wrap', description: 'Ranch, Cholula, Mixed Greens, Tomato, Onion, Jalapeno, Turkey, Avocado, Shredded Cheese in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 4, name: 'Veggie Pesto Wrap', description: 'Pesto, Oil & Vinegar, Mixed Greens, Tomato, Onion, Pepperoncini, Avocado, Cucumber, Carrot, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 5, name: 'Barbeque Buffalo Chicken Wrap', description: 'Ranch, Mixed Greens, Tomato, Onion, Pepperoncini. Barbeque Buffalo Chicken, Shredded Cheese in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 6, name: 'Veggie Med Wrap', description: 'Hummus, Ranch, Oil & Vinegar, Mixed Greens, Tomato, Onion, Cucumber, Carrot, Avocado, Pepperoncini, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 7, name: 'Chicken Caesar Wrap', description: 'Caesar Dressing, Mixed Greens, Tomato, Onion, Pepperoncini, Chicken, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                    ],
            },
            {
                title: 'Salads',
                data:
                    [
                        { choice: 0, name: 'Southwestern Chicken Wrap', description: 'Ranch, Cholula, Mixed Greens, Tomato, Onion, Jalapeno, Turkey, Avocado, Shredded Cheese in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 1, name: 'Pacific Rim Wrap', description: 'Sesame Ginger Vinaigrette, Mixed Greens, Tomato, Onion, Cucumber, Carrot, Chicken, Craisins in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 2, name: 'Italian Wrap', description: 'Mayonnaise, Deli Mustard, Oil and Vinegar, Mixed Greens, Tomato, Onion, Pepperoncini, Ham, Salami, Provolone, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 3, name: 'Southwestern Chicken Wrap', description: 'Ranch, Cholula, Mixed Greens, Tomato, Onion, Jalapeno, Turkey, Avocado, Shredded Cheese in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 4, name: 'Veggie Pesto Wrap', description: 'Pesto, Oil & Vinegar, Mixed Greens, Tomato, Onion, Pepperoncini, Avocado, Cucumber, Carrot, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 5, name: 'Barbeque Buffalo Chicken Wrap', description: 'Ranch, Mixed Greens, Tomato, Onion, Pepperoncini. Barbeque Buffalo Chicken, Shredded Cheese in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 6, name: 'Veggie Med Wrap', description: 'Hummus, Ranch, Oil & Vinegar, Mixed Greens, Tomato, Onion, Cucumber, Carrot, Avocado, Pepperoncini, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                        { choice: 7, name: 'Chicken Caesar Wrap', description: 'Caesar Dressing, Mixed Greens, Tomato, Onion, Pepperoncini, Chicken, Parmesan in a 12" wrap', is_drink: false, price: 13.99, },
                    ],
            },
            {
                title: 'Breakfast',
                data:
                    [
                        { choice: 0, name: 'Sausage Muffin', description: 'English Muffin, Egg, Sausage, Cheddar', is_drink: false, price: 6.49, },
                        { choice: 1, name: 'Chorizo Muffin', description: 'English Muffin, Egg, Chorizo, Cheddar, Avocado, Jalapeno, Pickled Onion', is_drink: false, price: 9.49, },
                        { choice: 2, name: 'Trifecta Breakfast Burrito', description: 'Tortilla, Cheese, Salsa, Egg, Chorizo, Sausage, Bacon, served with a side of "Cowboy Ketchup"', is_drink: false, price: 13.99, },
                        { choice: 3, name: 'Bacon Egg and Cheese', description: 'Bagel, Egg, Bacon, Cheddar', is_drink: false, price: 10.99, },
                        { choice: 4, name: 'Ham and Cheese Croissant', description: 'Ham and Cheese Croissant', is_drink: false, price: 10.99, },
                        { choice: 5, name: 'Trifecta Breakfast Bowl', description: 'Tots, Egg, Cheese, Salsa, Bacon, Sausage, Chorizo', is_drink: false, price: 13.99, },
                        { choice: 6, name: 'Veggie Breakfast Burrito', description: 'Tortilla, Spinach, Cheese, Egg, Salsa, Tomato, Avocado', is_drink: false, price: 13.99, },
                        { choice: 7, name: 'Peanut Butter & Jelly', description: 'English Muffin, Homemade Peanut Butter, Strawberry Jelly', is_drink: false, price: 6.49, },
                        { choice: 8, name: 'Manwich', description: 'Sourdough, Double Egg, Ham, Bacon, Sausage, Cheddar, Jack', is_drink: false, price: 17.99, },
                        { choice: 9, name: 'Hockey Puck', description: 'English Muffin, Egg, Sausage, Jack, Jalapeno, Strawberry Jam', is_drink: false, price: 9.49, },
                        { choice: 10, name: 'Veggie Breakfast Bowl', description: 'Tots, Eggs, Spinach, Tomato, Avocado, Cheese, Salsa', is_drink: false, price: 9.49, },
                    ],
            },
        ],
    }



}


export default partnerData