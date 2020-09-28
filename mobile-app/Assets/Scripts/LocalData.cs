using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LocalData : MonoBehaviour
{
    public static LocalData instance;
    public DataUnitType Unit { get; set; }
    public DataListrikType DataLast { get; set; } 
    public List<DataListrikTotalType> DataAll { get; set; }
	public DataListrikTahunanType DataTahunan { get; set; } 
	public string Token { get; set; }
	public List<NotificationType> Notifications {get; set; }


    private void Awake() {
        if (instance == null)
		{
			instance = this;
		} else
		{
			Destroy (gameObject);
			return;
		}

		DontDestroyOnLoad (gameObject);
    }
}
