using UnityEngine;
using System;
using System.Collections.Generic;

[System.Serializable] 
public class NotificationType    {
    public string _id { get; set; } 
    public int unit_id { get; set; }
    public string title { get; set; } 
    public string body { get; set; } 
    public DateTime date { get; set; }
    public bool is_viewed { get; set; } 
}

[System.Serializable]
public class RootNotificationType    {
    public bool success { get; set; } 
    public List<NotificationType> data { get; set; } 

}