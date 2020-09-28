using UnityEngine;
using System;

[System.Serializable]
public class DataListrikType    {
    public string _id { get; set; } 
    public string unit_id { get; set; } 
    public DateTime date_time { get; set; } 
    public double daya_sisa { get; set; } 
    public double daya_pemakaian { get; set; } 

}

[System.Serializable]
public class RootDataListrikType    {
    public bool success { get; set; } 
    public DataListrikType data { get; set; }

}