using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using Newtonsoft.Json;

public class Login : MonoBehaviour
{
    [SerializeField]
    private TMP_InputField unitId;
    [SerializeField]
    private TMP_InputField unitPin;
    [SerializeField]
    private TextMeshProUGUI errorText;
    [SerializeField]
    private Loading loadAnim;

    // Notif Popup
    [SerializeField]
    private GameObject notifPopup;
    [SerializeField]
    private TextMeshProUGUI notifText;

    // Registration
    [SerializeField]
    private GameObject userPanel;
    [SerializeField]
    private TMP_InputField userInput;
    [SerializeField]
    private TMP_InputField emailInput;
    [SerializeField]
    private GameObject alamatPanel;
    [SerializeField]
    private TMP_InputField provinsiInput;
    [SerializeField]
    private TMP_InputField kotaInput;
    [SerializeField]
    private TMP_InputField alamatInput;
    [SerializeField]
    private GameObject donePanel;


    public void LogIn() {
        if(unitId.text != "" && unitPin.text != "") {
            StartCoroutine(Authentication(unitId.text, unitPin.text));
        } else {
            Debug.Log("Please Input UNIT ID and PIN");
            DisplayError("Please Input UNIT ID and PIN");
        }
    }

    public void DisplayError(string message) {
        errorText.text = message;
    }

    public void NotifPopup(string message) {
        notifText.text = message;
        notifPopup.SetActive(true);
    }

    public void NotifConfirm() {
        notifPopup.SetActive(false);
    }

    public void RegisBack() {
        userPanel.SetActive(false);
        alamatPanel.SetActive(false);
        donePanel.SetActive(false);
        userInput.text = "";
        emailInput.text = "";
        provinsiInput.text = "";
        kotaInput.text = "";
        alamatInput.text = "";
    }

    public void RegisOpen() {
        userPanel.SetActive(true);
    }

    public void RegisUser() {
        if(userInput.text != "" && emailInput.text != "") {
            alamatPanel.SetActive(true);
            userPanel.SetActive(false);
        } else {
            NotifPopup("Masukan user id dan email");
        }
    }

    public void RegisAlamat() {
        if(alamatInput.text != "" && kotaInput.text != "" && provinsiInput.text != "") {
            StartCoroutine(RegisterNewUnit());
        } else {
            NotifPopup("Masukan provinsi, kota, dan alamat");
        }
    }

    IEnumerator Authentication(string unit, string pin) {
        loadAnim.StartLoading();
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/login/" + unit + "/" + pin);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
            DisplayError(www.error);
            loadAnim.StopLoading();
        } else {
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<TokenType>(response);

            LocalData.instance.Token = data.token;
            StartCoroutine(GetUnit(unit));
        }
    }

    IEnumerator GetUnit(string unit) {
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/api/get-unit/" + unit);
        www.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
            DisplayError(www.error);
            loadAnim.StopLoading();
        } else {
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<RootUnitType>(response);
            LocalData.instance.Unit = data.data;
            StartCoroutine(GetDataListrik(unit));
        }
    }

    IEnumerator GetDataListrik(string unit) {
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/api/get-datalistrik/" + unit);
        www.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
            // DisplayError(www.error);
            // loadAnim.StopLoading();
            LocalData.instance.DataLast = null;
            StartCoroutine(GetDataListrikTahunan(unit));
        } else {
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<RootDataListrikType>(response);
            LocalData.instance.DataLast = data.data;
            StartCoroutine(GetDataListrikTahunan(unit));
        }
    }

    IEnumerator GetDataListrikTahunan(string unit) {
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/api/get-datalistrik-tahunan/" + unit);
        www.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
            DisplayError(www.error);
            loadAnim.StopLoading();
        } else {
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<DataListrikTahunanType>(response);
            LocalData.instance.DataTahunan = data;
            SceneManager.LoadScene("Main");
        }
    }

    IEnumerator RegisterNewUnit() {
        loadAnim.StartLoading();
        WWWForm form = new WWWForm();
        form.AddField("user_id", userInput.text);
        form.AddField("email", emailInput.text);
        form.AddField("alamat", alamatInput.text);
        form.AddField("kota", kotaInput.text);
        form.AddField("provinsi", provinsiInput.text);
 
        UnityWebRequest www = UnityWebRequest.Post("https://api-meteran-pelanggan.herokuapp.com/unit/register", form);
        yield return www.SendWebRequest();
 
        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
            loadAnim.StopLoading();
        }
        else {
            Debug.Log("Form upload complete!");
            loadAnim.StopLoading();
            donePanel.SetActive(true);
            alamatPanel.SetActive(false);
            
            userInput.text = "";
            emailInput.text = "";
            alamatInput.text = "";
            kotaInput.text = "";
            provinsiInput.text = "";
        }
    }
}
