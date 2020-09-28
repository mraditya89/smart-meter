using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json;

public class ConnectionTest : MonoBehaviour
{
    private void Start() {
        StartCoroutine(GetUnit());
        StartCoroutine(GetDataListrik());
        StartCoroutine(GetDataListrikTotal());
    }

    IEnumerator GetUnit() {
        string unit = "001";
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-dashboard.herokuapp.com/api/get-unit/" + unit);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
        } else {
            Debug.Log(www.downloadHandler.text);
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            Debug.Log(response);
            var data = JsonConvert.DeserializeObject<RootUnitType>(response);
            Debug.Log(data.data.unit_id);
        }
    }

    IEnumerator GetDataListrik() {
        string unit = "001";
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-dashboard.herokuapp.com/api/get-datalistrik/" + unit);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
        } else {
            Debug.Log(www.downloadHandler.text);
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            Debug.Log(response);
            var data = JsonConvert.DeserializeObject<RootDataListrikType>(response);
            Debug.Log(data.data.daya_pemakaian);
        }
    }

    IEnumerator GetDataListrikTotal() {
        string unit = "001";
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-dashboard.herokuapp.com/api/get-datalistriktotal/" + unit);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
        } else {
            Debug.Log(www.downloadHandler.text);
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            Debug.Log(response);
            var data = JsonConvert.DeserializeObject<RootDataListrikTotalType>(response);
            Debug.Log(data.data[0].daya_pemakaian);
        }
    }
}
