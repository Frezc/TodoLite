package com.todolite;


import java.util.HashMap;
import java.util.Map;

/**
 * Created by Frezc on 2016/6/20.
 */
public class Constants {
    public static Map<String, Integer> typeIcons = new HashMap<>();

    static {
        typeIcons.put("default", R.drawable.ic_schedule_white_24dp);
        typeIcons.put("entertainment", R.drawable.ic_videogame_asset_white_24dp);
        typeIcons.put("work", R.drawable.ic_work_white_24dp);
        typeIcons.put("study", R.drawable.ic_book_white_24dp);
        typeIcons.put("trivia", R.drawable.ic_pets_white_24dp);
        typeIcons.put("outOfDoor", R.drawable.ic_directions_walk_white_24dp);
    }
}
