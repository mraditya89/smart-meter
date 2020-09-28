using UnityEngine;
using System;

[System.Serializable]
public class PaymentType {
    public string order_id { get; set; }
    public double price { get; set; }
    public string item_id { get; set; }
    public string item_name { get; set; }
    public string first_name { get; set; }
    public string last_name { get; set; }
    public string email { get; set; }
    public string phone { get; set; }
}

[System.Serializable]
public class ErrorMessage {
    public string message { get; set; }
}

[System.Serializable]
public class TokenResponse {
    public string token { get; set; }
    public string redirect_url { get; set; }
}