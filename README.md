This is my first solo project after completing the last project towards my code institute full stack software development diploma.
I have decided to build A simple game based on the much loved retro NES game "Duck Hunt". I am building this game using only HTML5 and CSS3.
I was inspired to do so by [This Video](https://www.youtube.com/watch?v=TL41NpYnhWo) by Kevin Powell on YouTube.
In particular I was amazed at this [Duck Hunt](https://codepen.io/hailedev/pen/MWJLGOq) game featured in the video.
I will start basic and build to the game over time.

### Build notes
I first attempted to have each duck set as a div with seperate I.D and used the hover class to pause the animation and make the opaque how ever when the user would move the cursor away the bird would carry on flying.

I found that if i gave the div a tab index I could use the focus class so that the duck had to be clicked. this solved the problem to a certain extent but when the user would click another bird the previous would re appear.

I did attempt to use a key frame "deadDuck" to change the image to a dead duck and animate the duck falling. This worked partly however the duck would not fall from where it was shot it would only fall from a preset location.

I then decided to change the duck divs to check boxes and labels enabling me to use css to make the duck dissapear when clicked on(checked). This provided a great temporary solution. while I research how to make the duck fall from its position of being shot without the use of Javascript.



##Credits
### Images

- The Gameplay Background, The fly duck and the dead duck images were created with DALL-E from prompts enginered by myself.
- The Target Mouse cursor was supplied by [The Noun Project](https://thenounproject.com/browse/icons/term/target-cursor/).
- All images were resized with GIMP.
- Both duck images backgrounds were removed using [Retoucher](https://retoucher.online/)