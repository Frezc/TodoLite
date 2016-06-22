package com.todolite.models;

import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by Frezc on 2016/6/20.
 */

public class Todo {
    public int id;
    @SerializedName("user_id")
    public int userId;
    public String title;
    public String status;
    public String type;
    @SerializedName("start_at")
    public int startAt;
    public int deadline;
    public int priority;
    public String location;
    public List<Content> contents;
    @SerializedName("created_at")
    public String createdAt;
    @SerializedName("updated_at")
    public String updatedAt;
}

