#audio-min  
File name: audio-min.js  

AUTHOR: Ryan Conrad  
VERSION: 1.0  
REQUIRED: Bootstrap Glyphicon Components  

This is a script for a custom audio-min tag's functionality.  
It's basically an audio player with a play/pause toggle  
button and optional mute button, all without the progress bar.  

USAGE: <audio-min attributes>(Error text goes here)</audiomin>  
Type "Default" as the error text to get a default message on error.  

ATTRIBUTES:  
  id: Unique title for tag  
  type: mp3, ogg and/or wav, delimited by '/'.  
  src: Source of audio file with or without extension.  
    NOTE: All audio files of different file types  
      must be in the same directory and have the  
      same file name with the exception of the  
      extension.  
  mutable: Boolean attribute. Set if a mute button is desired.
