# Food Delivery API

Food Delivery backend API for a web application. 

The API Requirements are as follows;


# Functional Requirements

- Users are enabled to sign up with their Fullname, 
    Unique Email Address ( i.e strictly one email to a user), 
    Phone number and Lastly create a strong Password.

- Users can be authenticated using their ERmail and Password.

- For each food listed or added in the food menu, 
    it must have a unique ID, name, description, 
    price, image and the category it belongs.

- Each food item can be added to the cart.

- Also as a cart is created the order automatically get created too, 
    where the total amount of money to be paid for the food items will be calculated.

- Also users can add food items to favorite cart.

- Users are also enabled to make payment for the items in the cart/order.

- Users can get all order histories of successful payments.



#   Food Delivery Services

1. Authentication service : This service handles User's Creation, User's Authentication, User's Authorization and Password Update.

2. User Service : This service handles profile/account update, get list of users, get a user.

3. Food service: Handles food creation, food listing, food update and to delete a food from the menu.

4. Cart/Order Service: Handles orders, adding to cart, removing from cart and to update a cart.

5. Favorite/Order Service: Handles orders, adding to favorite, removing from favorite and to update a favorite.

6. Order Checkout : Handles the collection of all items in the cart and check out the items after successful payment.

7. Order History : Handles the collection of order history of each user, user can get one history and can also delete from histories.



# DOCUMENTATION

    Food Delivery API Documentation : (https://documenter.getpostman.com/view/22719476/2s8YKCGi9R)




- 