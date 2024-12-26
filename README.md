# Tower of Hanoi - Interactive Web Game
### Video Demo: <https://youtu.be/c8OwxcV4jis>
### Description:

The Tower of Hanoi is a classic mathematical puzzle game implemented as an interactive web application 
using React and modern web technologies. This implementation features a drag-and-drop interface, dynamic disk sizing, 
and real-time move counting, making it both educational and engaging.

***
#### Technical Implementation

The project is built using React and leverages several key technologies:
- React DnD (Drag and Drop) for disk movement
- Tailwind CSS for styling
- React Hooks for state management
- Web Audio API for sound effects

***
 The main components are structured as follows:

1. `Disk`: Handles individual disk rendering and drag behavior. Each disk is styled dynamically based on its size, with larger disks having greater width and distinct colors using HSL color values. The component uses the `useDrag` hook from React DnD to manage drag operations.

2. `Tower`: Manages the tower structure and drop zones. It uses the `useDrop` hook to handle disk placement and validates moves according to game rules. The towers feature visual feedback during drag operations and play sound effects when disks are dropped successfully.

3. `TowerOfHanoi`: The core game logic component that maintains:
   - Game state (disk positions)
   - Move counter
   - Win condition checking
   - Disk count management
   - Game reset functionality
   - Sound effect management
   - Mute toggle functionality
***

#### Audio Implementation
The game features a comprehensive sound system:

1. **Background Music**: Subtle ambient music that plays continuously during gameplay
  
2. **Sound Effects**:

   - Disk pickup sound when grabbing a disk
   - Drop sound when placing a disk
   - Victory fanfare when completing the puzzle


3. **Audio Controls**:

   - Mute toggle button for all game audio
   - Volume management for background music
   - Proper cleanup of audio resources on component unmount

***

#### Design Decisions

Several key design decisions were made during development:

1. **Disk Sizing System**: Initially, I considered using fixed sizes for disks but opted for a dynamic sizing system (`size * 40px` for width) to ensure better scalability and visual harmony. This became particularly important when handling different numbers of disks (2-5).

2. **Color Scheme**: Instead of using static colors, I implemented a dynamic HSL-based color system (`hsl(${size * 30}, 70%, 50%)`). This creates a natural gradient effect where larger disks have distinct but complementary colors, enhancing visual hierarchy.

3. **Move Validation**: The validation system prevents illegal moves by:
   - Only allowing the top disk to be moved
   - Preventing larger disks from being placed on smaller ones
   - Implementing this at both the UI and logic levels for redundancy

4. **Sound Design**: The audio system was implemented with user experience in mind:

   - Non-intrusive background music with reduced volume
   - Short, satisfying sound effects for interactions
   - Proper audio resource management
   - Easy muting capability

5. **Responsive Design**: The game container uses Tailwind CSS's responsive classes to ensure playability across different screen sizes. The tower dimensions are percentage-based rather than fixed pixels to maintain proportions.

***
#### User Experience Features

The game includes several UX enhancements:

1. **Interactive Elements**:
   - A slider to adjust the number of disks (2-5)
   - Visual feedback during disk dragging
   - Move counter to track progress
   - Congratulatory message upon completion
   - Sound effects for user actions
   - Mute toggle for audio preferences

2. **Visual Feedback**:
   - Towers highlight when a valid disk is dragged over them
   - Invalid drop zones are clearly indicated
   - Disks have hover and active states for better interaction feedback
   - Audio-visual synchronization for actions
   
***

#### Future Enhancements

Potential improvements for future versions:

1. **Timer System**: Adding a timer to track solving speed
2. **Move Optimization**: Implementing a system to show the minimum required moves
3. **Solution Guide**: Adding an optional hint system for educational purposes
4. **Animation Improvements**: Enhanced transitions for disk movements
5. **Audio Enhancements**:

   - Multiple background music tracks
   - Volume control slider
   - Different sound themes

***

#### Learning Outcomes

This project served as an excellent exercise in:
- State management in React
- Drag and drop implementation
- Game logic development
- UI/UX design principles
- Component architecture
- Performance optimization
- Audio implementation in web applications
- Resource management

The Tower of Hanoi project demonstrates the implementation of a classic puzzle 
game while incorporating modern web development practices and user-centric design principles, and engaging audio-visual feedback systems.

***
#### Acknowledgments

- React DnD library for the drag and drop functionality
- Tailwind CSS for the styling system
- Web Audio API for sound implementation
- The open-source community for inspiration and resources