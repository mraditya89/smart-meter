using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using Newtonsoft.Json;

public class PaymentHandler : MonoBehaviour
{
    [SerializeField]
    private GameObject topupPanel;
    [SerializeField]
    private GameObject topupConfirmPanel;

    [SerializeField]
    private Loading loadAnim;

    [SerializeField]
    private TMP_InputField firstNameText;
    [SerializeField]
    private TMP_InputField lastNameText;
    [SerializeField]
    private TMP_InputField emailText;
    [SerializeField]
    private TMP_InputField phoneText;

    [SerializeField]
    private Main mainScript;

    private PaymentType param = new PaymentType();

    void Start() {
        firstNameText.text = PlayerPrefs.GetString("nama_depan");
        lastNameText.text = PlayerPrefs.GetString("nama_belakang");
        emailText.text = PlayerPrefs.GetString("email");
        phoneText.text = PlayerPrefs.GetString("phone");
    }

    public void TokenChoose(int token) {
        if(token == 50) {
            param.order_id = "meteran-" + LocalData.instance.Unit.unit_id.ToString() + "-" + token.ToString() + "-" + DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fffffffK");
            param.price = 100000;
            param.item_id = "kwh-50";
            param.item_name = "Saldo listrik 50 kWh";
        } else if(token == 100) {
            param.order_id = "meteran-" + LocalData.instance.Unit.unit_id.ToString() + "-" + token.ToString() + "-" + DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fffffffK");
            param.price = 200000;
            param.item_id = "kwh-100";
            param.item_name = "Saldo listrik 100 kWh";
        }
        topupPanel.SetActive(false);
        topupConfirmPanel.SetActive(true);
    }

    public void CancelButton() {
        topupPanel.SetActive(true);
        topupConfirmPanel.SetActive(false);
    }

    private bool InputValidator() {
        if(firstNameText.text == "" || lastNameText.text == "" || emailText.text == "" || phoneText.text == "") {
            mainScript.DisplayError("input data dengan benar");
            return false;
        } else if(firstNameText.text == null || lastNameText.text == null || emailText.text == null || phoneText.text == null) {
            mainScript.DisplayError("input data dengan benar");
            return false;
        } else {
            PlayerPrefs.SetString("nama_depan", firstNameText.text);
            PlayerPrefs.SetString("nama_belakang", lastNameText.text);
            PlayerPrefs.SetString("email", emailText.text);
            PlayerPrefs.SetString("phone", phoneText.text);
            return true;
        }
    }

    public void TopUpFunction() {
        if(InputValidator() == true) {
            param.first_name = firstNameText.text;
            param.last_name = lastNameText.text;
            param.email = emailText.text;
            param.phone = phoneText.text;

            string data = JsonConvert.SerializeObject(param);

            StartCoroutine(Post("https://api-meteran-payment.herokuapp.com/pay", data));
        }
    }

    IEnumerator Post(string url, string bodyJsonString)
    {
        loadAnim.StartLoading();

        var request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(bodyJsonString);
        request.uploadHandler = (UploadHandler) new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = (DownloadHandler) new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
 
        yield return request.SendWebRequest();
 
        Debug.Log("Status Code: " + request.responseCode);

        if(request.isNetworkError || request.isHttpError) {
            Debug.Log(request.error);
            string response = System.Text.Encoding.UTF8.GetString(request.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<ErrorMessage>(response);

            loadAnim.StopLoading();
            mainScript.DisplayError(data.message);
        } else {
            string response = System.Text.Encoding.UTF8.GetString(request.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<TokenResponse>(response);
            Debug.Log(data.redirect_url);

            loadAnim.StopLoading();
            mainScript.Home();
            Application.OpenURL(data.redirect_url);
        }
    }
}