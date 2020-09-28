using UnityEngine;
using System;
using System.Collections.Generic;

[System.Serializable] 
public class DataListrikTotalType    {
    public string _id { get; set; } 
    public int unit_id { get; set; } 
    public DateTime date_time { get; set; } 
    public double daya_sisa { get; set; } 
    public double daya_pemakaian { get; set; } 

}

[System.Serializable]
public class RootDataListrikTotalType    {
    public bool success { get; set; } 
    public List<DataListrikTotalType> data { get; set; } 

}