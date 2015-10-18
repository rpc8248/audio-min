/**
 * File name: audio-min.js
 *
 * AUTHOR: Ryan Conrad
 * VERSION: 1.0
 * REQUIRED: Bootstrap Glyphicon Components
 *
 * This is a script for a custom audio-min tag's functionality.
 * It's basically an audio player with a play/pause toggle
 * button and optional mute button, all without the progress bar.
 * 
 * USAGE: <audio-min attributes>(Error text goes here)</audiomin>
 * Type "Default" as the error text to get a default message on error.
 *
 * ATTRIBUTES:
 *  id: Unique title for tag
 *  type: mp3, ogg and/or wav, delimited by '/'.
 *  src: Source of audio file with or without extension.
 *      NOTE: All audio files of different file types
 *          must be in the same directory and have the
 *          same file name with the exception of the
 *          extension.
 *  mutable: Boolean attribute. Set if a mute button is desired.
 *  restart: Boolean attribute. Set if a restart button is desired.
 */

/**
 * Audio types associative array
 */
var audio_types = [];
audio_types["mp3"] = "audio/mpeg";
audio_types["ogg"] = "audio/ogg";
audio_types["wav"] = "audio/wav";

/**
 * Creates the audio players once the DOM content
 * has loaded.
 */
document.addEventListener("DOMContentLoaded", function(event) {
    create_min_audio_players();
});

/**
 * Finds all audio-min tags on the page and fills them
 * with a player for the requested audio source.
 */
function create_min_audio_players()
{
    // Get all audio-min tags
    var tags = document.getElementsByTagName("audio-min");
    
    // Loop through audio-min tags
    for(i = 0; i < tags.length; ++i)
    {
        // Save the attributes of the current tag
        var title = tags[i].getAttribute("id");
        var type = tags[i].getAttribute("type");
        var src = tags[i].getAttribute("src");
        var mutable = tags[i].hasAttribute("mutable");
        var restart = tags[i].hasAttribute("restart");
        
        // Create audio tag
        var audio = document.createElement("audio");
        
        // Copy error text from audio-min tag to audio tag.
        // Use default message if "Default" was written in the tag.
        if(tags[i].innerHTML.replace(/^\s+|\s+$/g, '').toUpperCase() 
                === "DEFAULT")
        {
            audio.innerHTML = "Audio tag unsupported in your browser.";
        }
        else audio.innerHTML = tags[i].innerHTML;
        tags[i].innerHTML = "";
        
        // import supported attribute values from audio-min tag
        for(j = 0; j < tags[i].attributes.length; ++j)
        {
            var attr = tags[i].attributes[j];
            if(attr != "id" && attr.name in audio)
            {
                audio.setAttribute(attr.name, attr.value);
            }
        }
        
        // Get types, as well as other attributes from audio-min
        var types = type.split("/");
        audio.type = audio_types[types[0]];
        audio.id = title + "-player";
        audio.src = src;
        
        // If multiple types were specified
        if(types.length > 1)
        {
            // Loop through types
            for(j = 0; j < types.length; ++j)
            {
                // Add the sources to the audio tag
                var source = document.createElement("source");
                // Filter extension
                if(src.endsWith("." + types[j]))
                {
                    source.src = src;
                }
                else source.src = src + "." + types[j];
                audio.appendChild(source);
            }
        }
        else
        {
            // If only one type specified, add it to the audio tag
            // Filter extension
            if(src.endsWith("." + type))
            {
                audio.src = src;
            }
            else audio.src = src + "." + type;
        }
        tags[i].appendChild(audio);
        
        // Create play button. Use Glyphicons.
        var play_button = document.createElement("button");
        play_button.setAttribute('onclick',
            "toggle_play_pause(document.getElementById('" 
            + audio.id + "'), this)");
        play_button.className = 'glyphicon glyphicon-play btn btn-default'
        play_button.id = title + '-play';
        tags[i].appendChild(play_button);
        
        // Create mute button if requested. Use Glyphicons.
        if(mutable)
        {
            var mute_button = document.createElement("button");
            mute_button.setAttribute('onclick',
                "toggle_mute(document.getElementById('" 
                + audio.id + "'), this)");
            mute_button.className = 
                'glyphicon glyphicon-volume-off btn btn-default'
            mute_button.id = title + '-mute'
            tags[i].appendChild(mute_button);
        }
        
        // Create restart button if requested. Use Glyphicons.
        if(restart)
        {
            var restart_button = document.createElement("button");
            restart_button.setAttribute('onclick',
                "restart_song(document.getElementById('" 
                + audio.id + "'))");
            restart_button.className = 
                'glyphicon glyphicon-fast-backward btn btn-default'
            restart_button.id = title + '-restart'
            tags[i].appendChild(restart_button);
        }
    }
    
    // Set up onended event for each audio tag
    songs = document.getElementsByTagName('audio');
    for(i = 0; i < songs.length; ++i)
    {
        songs[i].onended = function(event) {
            // Get ids for play and mute buttons
            id = event.target.id.replace('-player','-play');
            play_button = document.getElementById(id);
            id = event.target.id.replace('-player','-mute');
            mute_button = document.getElementById(id);
            
            // Reset buttons for chosen song to "play" and "mute" states
            play_button.className = play_button.className.replace(
                'glyphicon-pause','glyphicon-play');
            if(mute_button)
            {
                toggle_mute_button(true, mute_button);
            }
        }
    }
}

/**
 * Toggle play/pause button and audio for a given piece of audio when clicked.
 *
 * song: The audio tag's id
 * button: The button to toggle
 */
function toggle_play_pause(song, button)
{
    // If paused
    if(song.paused)
    {
        // Get audio tags
        songs = document.getElementsByTagName('audio');
        for(i = 0; i < songs.length; ++i)
        {
            // If it's not the requested song
            if(song != songs[i])
            {
                // Pause the song and reset the current time
                songs[i].pause();
                if(songs[i].currentTime != 0)
                {
                    songs[i].currentTime = 0;
                }
            }
        }
        
        // Change all pause buttons to play buttons
        buttons = document.getElementsByClassName('glyphicon-pause');
        for(i = 0; i < buttons.length; ++i)
        {
            toggle_play_pause_button(true,buttons[i]);
        }
        
        // Change all unmuted buttons to muted buttons
        buttons = document.getElementsByClassName('glyphicon-volume-up');
        for(i = 0; i < buttons.length; ++i)
        {
            toggle_mute_button(true,buttons[i]);
        }
            
        // Get the mute button's id
        mute_id = button.id.replace('-play','-mute');
        
        // Get the mute button and toggle it
        mute_button = document.getElementById(mute_id);
        if(mute_button)
        {
            toggle_mute_button(false, mute_button);
        }
        
        // Play the song and change the play button to a pause button
        song.muted = false;
        song.play();
        toggle_play_pause_button(song.paused,button);
    }
    else
    {
        // Otherwise, simply pause the song and change the button
        song.pause();
        toggle_play_pause_button(song.paused,button);
    }
}

/**
 * Toggle play/pause button for a given piece of audio when clicked.
 *
 * song_paused: True if audio is paused. False otherwise.
 * button: The button to toggle
 */
function toggle_play_pause_button(song_paused, button)
{
    // Change button's class name based on song paused status
    if(song_paused)
    {
        button.className = button.className.replace(
                'glyphicon-pause','glyphicon-play');
    }
    else
    {
        button.className = button.className.replace(
                'glyphicon-play','glyphicon-pause');
    }
}

/**
 * Toggle mute button and audio for a given piece of audio when clicked.
 *
 * song: The audio tag's id
 * button: The button to toggle
 */
function toggle_mute(song, button)
{
    // Toggle the audio and toggle the button
    song.muted = !song.muted
    toggle_mute_button(song.muted, button);
}

/**
 * Toggle mute button for a given piece of audio when clicked.
 *
 * song_muted: True if audio is muted. False otherwise.
 * button: The button to toggle
 */
function toggle_mute_button(song_muted, button)
{
    // Change button's class name based on song muted status
    if(song_muted)
    {
        button.className = button.className.replace(
            'glyphicon-volume-up','glyphicon-volume-off');
    }
    else
    {
        button.className = button.className.replace(
            'glyphicon-volume-off','glyphicon-volume-up');
    }
}

/**
 * Restart song when the restart button is clicked.
 *
 * song: The audio tag's id
 */
function restart_song(song)
{
    // Reset the current time
    if(song.currentTime != 0)
    {
        song.currentTime = 0;
    }
}
