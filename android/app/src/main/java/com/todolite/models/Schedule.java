package com.todolite.models;

import java.util.List;


/**
 * Created by Frezc on 2016/6/20.
 */
public class Schedule {
    public boolean ready;
    public int[] data;
    public String statusFilter;
    public String typeFilter;
    public String searchText;

    @Override
    public String toString() {
        return data.toString();
    }
}
