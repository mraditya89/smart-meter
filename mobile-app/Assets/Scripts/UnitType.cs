using UnityEngine;
using System;

[System.Serializable]
public class DataUnitType    {
    public string _id { get; set; } 
    public int unit_id { get; set; } 
    public string pin { get; set; } 
    public string alamat { get; set; } 
    public string kota { get; set; } 
    public string provinsi { get; set; } 
    public string user_id { get; set; } 
    public int status_code { get; set; } 
    public DateTime last_modified { get; set; } 
    public int last_modified_by { get; set; }
    public bool is_new_key { get; set; }
    public bool is_responding { get; set; }
    public string last_known_key { get; set; }
    public string email { get; set; } 

}

[System.Serializable]
public class RootUnitType    {
    public bool success { get; set; } 
    public DataUnitType data { get; set; } 

}