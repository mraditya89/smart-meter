using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using Newtonsoft.Json;
using UnityEngine.UI;

public class Main : MonoBehaviour
{
    [SerializeField]
    private GameObject homePanel;
    [SerializeField]
    private GameObject dataPanel;
    [SerializeField]
    private GameObject topupPanel;
    [SerializeField]
    private GameObject topupConfirmPanel;

    [SerializeField]
    private GameObject morePanel;
    [SerializeField]
    private GameObject relayConfirmPopup;
    [SerializeField]
    private TextMeshProUGUI relayConfirmText;
    private string relayCode = "0";
    [SerializeField]
    private GameObject notifPopup;
    [SerializeField]
    private TextMeshProUGUI notifText;
    [SerializeField]
    private GameObject notifSessionPopup;

    [SerializeField]
    private Loading loadAnim;
    [SerializeField]
    private GameObject panelError;
    [SerializeField]
    private TextMeshProUGUI errorText;

    // Change PIN Pop Up
    [SerializeField]
    private GameObject changePinPopup;
    [SerializeField]
    private TMP_InputField oldPin;
    [SerializeField]
    private TMP_InputField newPin;
    [SerializeField]
    private TMP_InputField newPinConfirm;

    // Beranda Page
    [SerializeField]
    private TextMeshProUGUI unitIdText;
    [SerializeField]
    private TextMeshProUGUI statusText;
    [SerializeField]
    private TextMeshProUGUI saldoText;
    [SerializeField]
    private TextMeshProUGUI userIdText;
    [SerializeField]
    private TextMeshProUGUI locationText;

    // Data Listrik Page
    [SerializeField]
    private TextMeshProUGUI dateText;
    [SerializeField]
    private TextMeshProUGUI saldo2Text;
    [SerializeField]
    private TextMeshProUGUI dayaBulanText;

    private PAGE currentPage = PAGE.HOME;
    [SerializeField]
    private TextMeshProUGUI pageText;

    // Notification
    private bool isNotificationAvailable = false;
    [SerializeField]
    private GameObject notificationIndicator;
    [SerializeField]
    private GameObject notificationPanel;
    [SerializeField]
    private GameObject[] notifications;
    [SerializeField]
    private TextMeshProUGUI[] notifTitle;
    [SerializeField]
    private TextMeshProUGUI[] notifBody;
    [SerializeField]
    private TextMeshProUGUI[] notifDate;

    // Data Chart
    [SerializeField]
    private TextMeshProUGUI value25;
    [SerializeField]
    private TextMeshProUGUI value50;
    [SerializeField]
    private TextMeshProUGUI value75;
    [SerializeField]
    private TextMeshProUGUI value100;
    [SerializeField]
    private RectTransform[] barFill;
    [SerializeField]
    private TextMeshProUGUI[] barValue;

    private enum PAGE {
        HOME,
        DATA,
        TOPUP,
    }

    private void Start() {
        currentPage = PAGE.HOME;
        HomeDisplay();
        DataDisplay();

        string topic = PlayerPrefs.GetString("topic", "off");
        if(topic == "off") {
            FirebaseServiceHandler.instance.SubscribeTopic(LocalData.instance.Unit.unit_id.ToString());
        } else if(topic != LocalData.instance.Unit.unit_id.ToString()) {
            FirebaseServiceHandler.instance.UnsubscribeTopic();
            FirebaseServiceHandler.instance.SubscribeTopic(LocalData.instance.Unit.unit_id.ToString());
        }

        StartCoroutine(GetNotification(LocalData.instance.Unit.unit_id.ToString()));
    }

    private void HomeDisplay() {
        unitIdText.text = LocalData.instance.Unit.unit_id.ToString();
        if(LocalData.instance.Unit.status_code == 0 || LocalData.instance.Unit.status_code == 2) {
            statusText.text = "Off";
        } else if(LocalData.instance.Unit.status_code == 1 || LocalData.instance.Unit.status_code == 3) {
            statusText.text = "On";
        }
        if(LocalData.instance.DataLast != null) {
            saldoText.text = LocalData.instance.DataLast.daya_sisa.ToString("0.##") + " kWh";
        }
        userIdText.text = LocalData.instance.Unit.user_id;
        locationText.text = LocalData.instance.Unit.alamat + ", " + LocalData.instance.Unit.kota + ", " + LocalData.instance.Unit.provinsi;
    }

    private void DataDisplay() {
        if(LocalData.instance.DataLast != null) {
            dateText.text = LocalData.instance.DataLast.date_time.ToString();
            saldo2Text.text = LocalData.instance.DataLast.daya_sisa.ToString("0.##") + " kWh"; 
        }
        dayaBulanText.text = LocalData.instance.DataTahunan.data[System.DateTime.Now.Month-1].ToString("0.##") + " kWh";

        double dayaMax = 0;
        foreach(var data in LocalData.instance.DataTahunan.data) {
            if(data >= dayaMax) {
                dayaMax = data;
            }
        }
        value25.text = (dayaMax*0.25f).ToString("0.##");
        value50.text = (dayaMax*0.5f).ToString("0.##");
        value75.text = (dayaMax*0.75f).ToString("0.##");
        value100.text = (dayaMax).ToString("0.##");
        for(int i=0; i < 12; i++) {
            float value = 0;
            if(LocalData.instance.DataTahunan.data[i] != 0) {
                value = (float) (LocalData.instance.DataTahunan.data[i] / dayaMax) * 650f;
            }
            barFill[i].sizeDelta = new Vector2(barFill[i].rect.width, value);
            barValue[i].text = LocalData.instance.DataTahunan.data[i].ToString("0.##");
        }
    }

    public void Home() {
        if(currentPage == PAGE.DATA) {
            dataPanel.SetActive(false);
        } else if(currentPage == PAGE.TOPUP) {
            topupPanel.SetActive(false);
            topupConfirmPanel.SetActive(false);
        }
        homePanel.SetActive(true);
        currentPage = PAGE.HOME;
        pageText.text = "Beranda";
    }

    public void Data() {
        if(currentPage == PAGE.HOME) {
            homePanel.SetActive(false);
        } else if(currentPage == PAGE.TOPUP) {
            topupPanel.SetActive(false);
            topupConfirmPanel.SetActive(false);
        }
        dataPanel.SetActive(true);
        currentPage = PAGE.DATA;
        pageText.text = "Data Kelistrikan";
    }

    public void Topup() {
        if(currentPage == PAGE.HOME) {
            homePanel.SetActive(false);
        } else if(currentPage == PAGE.DATA) {
            dataPanel.SetActive(false);
        }
        topupConfirmPanel.SetActive(false);
        topupPanel.SetActive(true);
        currentPage = PAGE.TOPUP;
        pageText.text = "Top Up Saldo";
    }

    public void NotificationOpen() {
        if(isNotificationAvailable == true) {
            notificationPanel.SetActive(true);
            foreach(GameObject notification in notifications) {
                notification.SetActive(false);
            }
            for(int i = 0; i < LocalData.instance.Notifications.Count; i++) {
                notifications[i].SetActive(true);
            }
            isNotificationAvailable = false;
            notificationIndicator.SetActive(false);
            StartCoroutine(SettNotificationIsViewed(LocalData.instance.Unit.unit_id.ToString()));
        } else {
            DisplayError("Tidak ada notifikasi");
        }
    }

    public void NotificationClose() {
        notificationPanel.SetActive(false);
        LocalData.instance.Notifications.Clear();
    }

    public void More() {
        morePanel.SetActive(true);
    }

    public void MoreBack() {
        morePanel.SetActive(false);
    }

    public void Logout() {
        LocalData.instance.Unit = null;
        LocalData.instance.DataLast = null;
        LocalData.instance.DataAll = null;
        SceneManager.LoadScene("Login");
    }

    public void Refresh() {
        loadAnim.StartLoading();
        StartCoroutine(GetUnit(LocalData.instance.Unit.unit_id.ToString()));
    }

    public void ChangePinOpen() {
        changePinPopup.SetActive(true);
    }

    public void ChangePinClose() {
        changePinPopup.SetActive(false);
        oldPin.text = "";
        newPin.text = "";
        newPinConfirm.text = "";
    }

    public void ChangePinConfirm() {
        if(oldPin.text != "" && newPin.text != "" && newPin.text.Length == 6 && newPinConfirm.text != "" && newPinConfirm.text.Length == 6) {
            if(newPin.text == newPinConfirm.text) {
                StartCoroutine(SetNewPin(LocalData.instance.Unit.unit_id.ToString()));
            } else {
                NotificationPopup("Pastikan password baru dan konfirmasi password baru sama");
            }
        } else {
            NotificationPopup("Masukan PIN lama and PIN baru, PIN harus berupa 6 digit angka");
        }
    }

    IEnumerator SetNewPin(string unit) {
        loadAnim.StartLoading();
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/api/pin-change/" + unit + "/" + oldPin.text + "/" + newPin.text);
        www.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
            loadAnim.StopLoading();
            NotificationPopup("PIN tidak berhasil dibuat, Cek masukan PIN lama");
        } else {
            // string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            // var data = JsonConvert.DeserializeObject<RootNotificationType>(response);
            Debug.Log("PIN Changed");
            loadAnim.StopLoading();
            ChangePinClose();
            NotificationPopup("PIN berhasil diganti");
        }
    }

    public void DisplayError(string message) {
        errorText.text = message;
        panelError.SetActive(true);
        Invoke("DisableError", 3f);
    }

    private void DisableError() {
        panelError.SetActive(false);
    }

    public void RelayConfirm(string ison) {
        relayCode = ison;
        if(ison == "0") {
            relayConfirmText.text = "Matikan unit meteran ?";
            if(LocalData.instance.Unit.status_code == 0 || LocalData.instance.Unit.status_code == 2) {
                NotificationPopup("Meteran sudah dalam keadaan mati");
            } else {
                relayConfirmPopup.SetActive(true);
            }
        } else if(ison == "1") {
            relayConfirmText.text = "Nyalakan unit meteran ?";
            if(LocalData.instance.Unit.status_code == 1 || LocalData.instance.Unit.status_code == 3) {
                NotificationPopup("Meteran sudah dalam keadaan menyala");
            } else {
                if(LocalData.instance.Unit.last_modified_by == 1) {
                    NotificationPopup("Meteran dimatikan oleh pengelola");
                } else if(LocalData.instance.Unit.last_modified_by == 2) {
                    NotificationPopup("Meteran mati karena saldo habis");
                } else if(LocalData.instance.Unit.last_modified_by == 3) {
                    NotificationPopup("Meteran mati karena overload");
                } else {
                    relayConfirmPopup.SetActive(true);
                }
            }
        }
    }

    public void RelayConfirmCancel() {
        relayConfirmPopup.SetActive(false);
    }

    public void NotificationPopup(string message) {
        notifText.text = message;
        notifPopup.SetActive(true);
    }

    public void NotifConfirm() {
        notifPopup.SetActive(false);
    }

    public void NotifSessionConfirm() {
        SceneManager.LoadScene("Login");
    }

    public void RelayOn() {
        StartCoroutine(SetRelay(relayCode));
    }

    IEnumerator GetUnit(string unit) {
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/api/get-unit/" + unit);
        www.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            Debug.Log(www.error);
            notifSessionPopup.SetActive(true);
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
            notifSessionPopup.SetActive(true);
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
            // Asumsi error network
            Debug.Log(www.error);
            notifSessionPopup.SetActive(true);
        } else {
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<DataListrikTahunanType>(response);
            LocalData.instance.DataTahunan = data;

            StartCoroutine(GetNotification(unit));
            HomeDisplay();
            DataDisplay();
        }
    }

    IEnumerator GetNotification(string unit) {
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/api/notif-get/" + unit);
        www.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            // Mungkin tak ada notifikasi
            Debug.Log(www.error);
        } else {
            string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<RootNotificationType>(response);
            LocalData.instance.Notifications = data.data;

            if(LocalData.instance.Notifications.Count >= 5) {
                for(int i = 0; i < 5; i++) {
                    notifTitle[i].text = LocalData.instance.Notifications[i].title;
                    notifBody[i].text = LocalData.instance.Notifications[i].body;
                    notifDate[i].text = LocalData.instance.Notifications[i].date.ToString();
                }
            } else {
                for(int i = 0; i < LocalData.instance.Notifications.Count; i++) {
                    notifTitle[i].text = LocalData.instance.Notifications[i].title;
                    notifBody[i].text = LocalData.instance.Notifications[i].body;
                    notifDate[i].text = LocalData.instance.Notifications[i].date.ToString();
                }
            }
            isNotificationAvailable = true;
            notificationIndicator.SetActive(true);
        }
        loadAnim.StopLoading();
        DisplayError("Data Successfully Refreshed");
    }

    IEnumerator SettNotificationIsViewed(string unit) {
        UnityWebRequest www = UnityWebRequest.Get("https://api-meteran-pelanggan.herokuapp.com/api/notif-viewed/" + unit);
        www.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        yield return www.SendWebRequest();

        if(www.isNetworkError || www.isHttpError) {
            // Mungkin tak ada notifikasi
            Debug.Log(www.error);
        } else {
            // string response = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
            // var data = JsonConvert.DeserializeObject<RootNotificationType>(response);
            Debug.Log("Notofication set to viewed");
        }
    }

    IEnumerator SetRelay(string ison) {
        loadAnim.StartLoading();
        string url = "http://18.139.0.195:1880/server_meter_api/v1/";

        var request = new UnityWebRequest(url, "POST");
        request.downloadHandler = (DownloadHandler) new DownloadHandlerBuffer();
        request.SetRequestHeader("Authorization", "Bearer " + LocalData.instance.Token);
        request.SetRequestHeader("op_code", "5");
        request.SetRequestHeader("id", LocalData.instance.Unit.unit_id.ToString());
        request.SetRequestHeader("ison", ison);
        request.SetRequestHeader("rcode", "0");

        yield return request.SendWebRequest();

        if(request.isNetworkError || request.isHttpError) {
            Debug.Log(request.error);
            string response = System.Text.Encoding.UTF8.GetString(request.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<ErrorMessage>(response);

            loadAnim.StopLoading();
            DisplayError(data.message);
            relayConfirmPopup.SetActive(false);
        } else {
            string response = System.Text.Encoding.UTF8.GetString(request.downloadHandler.data);
            var data = JsonConvert.DeserializeObject<TokenResponse>(response);
            Debug.Log(response);

            loadAnim.StopLoading();
            relayConfirmPopup.SetActive(false);

            if(ison == "0") {
                NotificationPopup("Meteran berhasil dimatikan. Mohon tunggu beberapa saat dan refresh data");
            } else if(ison == "1") {
                NotificationPopup("Meteran berhasil dinyalakan. Mohon tunggu beberapa saat dan refresh data");
            }
        }
    }

}
