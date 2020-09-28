using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Loading : MonoBehaviour
{
    [SerializeField]
    private GameObject panel;
    [SerializeField]
    private GameObject[] dot;

    private bool isLoading = false;

    public void StartLoading() {
        isLoading = true;
        panel.SetActive(true);
        for(int i = 0; i < dot.Length; i++) {
            dot[i].SetActive(false);
        }
        StartCoroutine(LoadAnim());
    }

    public void StopLoading() {
        isLoading = false;
        for(int i = 0; i < dot.Length; i++) {
            dot[i].SetActive(false);
        }
        panel.SetActive(false);
    }

    IEnumerator LoadAnim() {
        yield return new WaitForSeconds(0.5f);
        while(isLoading) {
            for(int i = 0; i < dot.Length; i++) {
                dot[i].SetActive(true);
                yield return new WaitForSeconds(0.5f);
            }
            for(int i = 0; i < dot.Length; i++) {
                dot[i].SetActive(false);
            }
            yield return new WaitForSeconds(0.5f);
        }
    }

}
