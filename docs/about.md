# GraphChat Application Documentation

## Overview

GraphChat is an interactive web application that combines graph visualization with chat-based interaction. It allows users to create, save, and interact with graph-based projects through a dual-mode interface that supports both graph creation and element highlighting.

## Core Features

### 1. Graph Visualization

- Displays interactive graphs with nodes and edges
- Supports dynamic graph updates and modifications
- Provides visual highlighting of selected graph elements

### 2. Dual-Mode Operation

The application operates in two distinct modes:

- **Create Mode**: Allows users to generate new graph structures through AI-assisted authoring
- **Highlight Mode**: Enables users to highlight specific nodes and edges in existing graphs

### 3. Project Management

- **Local Storage Integration**: Projects are automatically saved to the browser's local storage
- **Project List**: Maintains a chronological list of saved projects
- **Project Loading**: Users can load previously saved projects
- **Project Creation**: New projects can be created and saved with unique IDs

### 4. Example Graphs

The application includes several pre-built example graphs for demonstration:

- Animals
- Family
- Snacks

### 5. User Interface

The interface is divided into three main sections:

- **Left Panel**: Project management and examples
- **Main Canvas**: Graph visualization area
- **Bottom Panel**: Chat input with mode switching

### 6. Interactive Features

- **Element Selection**: Users can click on graph elements to select/deselect them
- **Chat Interface**: Text-based interaction for both graph creation and element highlighting
- **Mode Switching**: Toggle between creation and highlighting modes
- **Save Functionality**: Quick save button for creating new projects

## Technical Implementation

- Built using React with TypeScript
- Uses a custom UI component library
- Implements UUID for unique project identification
- Features responsive layout with flexible viewport sizing
- Includes error handling for JSON parsing and API responses

## Usage Flow

1. Users can start with example graphs or create new ones
2. The chat interface allows for natural language interaction
3. Projects can be saved and loaded at any time
4. The application maintains state between sessions using local storage
5. Users can switch between creation and highlighting modes as needed

## Development Features

- Includes a testing mode for development purposes
- Provides example data structures for quick testing
- Implements error handling and logging for debugging

This application appears to be designed for both educational and practical purposes, allowing users to interact with graph structures in an intuitive way while maintaining the ability to save and manage their work.
