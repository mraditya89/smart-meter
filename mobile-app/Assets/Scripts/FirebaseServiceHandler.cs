using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class FirebaseServiceHandler : MonoBehaviour
{
    public static FirebaseServiceHandler instance;
    [SerializeField]
    private Login loginScript;

    private bool isInitialize = false;
    public string topic = "off";

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

    private void Start() {
        topic = PlayerPrefs.GetString("topic", "off");

        Firebase.FirebaseApp.CheckAndFixDependenciesAsync().ContinueWith(task => {
        var dependencyStatus = task.Result;
        if (dependencyStatus == Firebase.DependencyStatus.Available) {
            // Create and hold a reference to your FirebaseApp,
            // where app is a Firebase.FirebaseApp property of your application class.
            // var app = Firebase.FirebaseApp.DefaultInstance;
            Debug.Log("Firebase is ready to use");
            // Set a flag here to indicate whether Firebase is ready to use by your app.

            InitializeFirebase();
        } else {
            UnityEngine.Debug.LogError(System.String.Format(
            "Could not resolve all Firebase dependencies: {0}", dependencyStatus));
            // Firebase Unity SDK is not safe to use here.
            Debug.Log("Firebase Unity SDK is not safe to use here");
        }
        });
    }

    private void InitializeFirebase() {
        Firebase.Messaging.FirebaseMessaging.TokenReceived += OnTokenReceived;
        Firebase.Messaging.FirebaseMessaging.MessageReceived += OnMessageReceived;
        if(topic == "off") {
            Debug.Log("No topic subscribed");
        } else {
            Debug.Log("There is topic subscribed");
            Firebase.Messaging.FirebaseMessaging.SubscribeAsync(topic);
        }
        // Firebase.Messaging.FirebaseMessaging.SubscribeAsync("Unit-1");

        isInitialize = true;
    }

    public void SubscribeTopic(string topicParam) {
        if(isInitialize) {
            topic = topicParam;
            PlayerPrefs.SetString("topic", topic);
            Firebase.Messaging.FirebaseMessaging.SubscribeAsync(topic);
        }
    }

    public void UnsubscribeTopic() {
        if(isInitialize) {
            Firebase.Messaging.FirebaseMessaging.UnsubscribeAsync(topic);
        }
    }

    public void OnTokenReceived(object sender, Firebase.Messaging.TokenReceivedEventArgs token) {
        Debug.Log("Received Registration Token: " + token.Token);
    }

    public void OnMessageReceived(object sender, Firebase.Messaging.MessageReceivedEventArgs e) {
        Debug.Log("Received a new message from: " + e.Message.From);
        Debug.Log("Received a new message");
        var notification = e.Message.Notification;
        if (notification != null) {
            Debug.Log("title: " + notification.Title);
            Debug.Log("body: " + notification.Body);
            var android = notification.Android;
            if (android != null) {
                Debug.Log("android channel_id: " + android.ChannelId);
            }
        }
        if (e.Message.From.Length > 0)
            Debug.Log("from: " + e.Message.From);
        if (e.Message.Link != null) {
            Debug.Log("link: " + e.Message.Link.ToString());
        }
        if (e.Message.Data.Count > 0) {
            Debug.Log("data:");
            foreach (System.Collections.Generic.KeyValuePair<string, string> iter in
                    e.Message.Data) {
                Debug.Log("  " + iter.Key + ": " + iter.Value);
            }
        }
    }
}
