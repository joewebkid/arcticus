using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;

public class GameEngine : MonoBehaviour
{
    public Player player;
    public int currentStep = 0;
    public int currentMessageIndex = 0;
    public List<Message> messages = new List<Message>();
    public List<string> selectedOptions = new List<string>();

    void Start()
    {
        StartCoroutine(LoadQuest(ExecuteStep, currentStep));
    }

    IEnumerator LoadQuest(System.Action<int> callback, int stepId)
    {
        string url = "/data/ar_" + stepId + ".json";
        UnityWebRequest www = UnityWebRequest.Get(url);
        www.SetRequestHeader("Content-Type", "application/json");

        yield return www.SendWebRequest();

        if (www.result == UnityWebRequest.Result.ConnectionError || www.result == UnityWebRequest.Result.ProtocolError)
        {
            Debug.LogError(www.error);
        }
        else
        {
            string data = www.downloadHandler.text;
            QuestStep step = JsonUtility.FromJson<QuestStep>(data);
            callback(step);
        }
    }

    void ExecuteStep(QuestStep step)
    {
        ClearMessage();
        ClearOptions();
        currentMessageIndex = 0;
        currentStep = step.id;

        if (!player.visitedSteps.Contains(step.id))
        {
            player.visitedSteps.Add(step.id);
        }

        messages = step.messages;

        if (messages.Count > 0)
        {
            ShowNextMessage();
        }

        if (step.item != null)
        {
            player.inventory.Add(step.item);
            ShowMessage("Система", "Получен предмет: " + step.item.name);
        }

        if (step.character != null)
        {
            player.encounteredCharacters.Add(step.character);
        }

        if (step.location != null)
        {
            UpdateLocationImage(step.location.image);
        }

        if (step.options != null)
        {
            UpdateOptions(step.options);
        }
    }

    void ShowNextMessage()
    {
        if (currentMessageIndex < messages.Count)
        {
            Message message = messages[currentMessageIndex];

            if (!ShouldShowObject(message))
            {
                currentMessageIndex++;
                ShowNextMessage();
                return;
            }

            ShowMessage(message.author, message.content, message.avatar);

            bool lastBlock = currentMessageIndex + 1 == messages.Count;

            GameObject typingIndicator = GameObject.Find("typingIndicator");
            typingIndicator.SetActive(!lastBlock);

            GameObject optionsContainer = GameObject.Find("optionsList");
            optionsContainer.SetActive(lastBlock);

            currentMessageIndex++;
        }
    }

    void ShowMessage(string author, string content, string avatar = null)
    {
        GameObject chatWindow = GameObject.Find("chatWindow");
        GameObject chatContainer = GameObject.Find("chatContainer");
        GameObject messageContainer = new GameObject("message");
        messageContainer.transform.parent = chatContainer.transform;

        GameObject authorElement = new GameObject("author");
        authorElement.transform.parent = messageContainer.transform;
        authorElement.GetComponent<TextMesh>().text = author;

        GameObject avatarElement = null;
        if (avatar != null)
        {
            avatarElement = new GameObject("avatar");
            avatarElement.transform.parent = messageContainer.transform;
            avatarElement.transform.position = new Vector3(0, 0, 0);
            avatarElement.GetComponent<SpriteRenderer>().sprite = Resources.Load<Sprite>(avatar);
        }

        GameObject contentElement = new GameObject("content");
        contentElement.transform.parent = messageContainer.transform;
        contentElement.GetComponent<TextMesh>().text = content;

        if (author == "Система")
        {
            messageContainer.GetComponent<MeshRenderer>().material.color = Color.red;
        }

        chatWindow.GetComponent<ChatWindow>().ScrollToBottom();
    }

    void UpdateLocationImage(string imageUrl)
    {
        GameObject locationImage = GameObject.Find("locationImage");
        Sprite sprite = Resources.Load<Sprite>(imageUrl);
        locationImage.GetComponent<SpriteRenderer>().sprite = sprite;
    }

    void UpdateOptions(List<Option> options)
    {
        GameObject optionsContainer = GameObject.Find("optionsList");

        foreach (Option option in options)
        {
            if (ShouldShowObject(option))
            {
                GameObject optionElement = CreateOptionElement(option);
                optionElement.transform.parent = optionsContainer.transform;
            }
        }
    }

    GameObject CreateOptionElement(Option option)
    {
        GameObject optionElement = new GameObject("option");
        optionElement.AddComponent<TextMesh>();
        optionElement.GetComponent<TextMesh>().text = option.text;
        optionElement.GetComponent<BoxCollider>().size = new Vector3(1, 1, 0);
        optionElement.AddComponent<OptionHandler>().option = option;

        return optionElement;
    }

    bool ShouldShowObject(Message message)
    {
        if (message.once && selectedOptions.Contains(message.id))
        {
            return false;
        }

        if (message.item != null && !player.inventory.Contains(message.item))
        {
            return false;
        }

        if (message.characters != null && !message.characters.TrueForAll(player.encounteredCharacters.Contains))
        {
            return false;
        }

        if (message.showIfStep != null && !message.showIfStep.TrueForAll(player.visitedSteps.Contains))
        {
            return false;
        }

        if (message.hideIfStep != null && message.hideIfStep.Exists(player.visitedSteps.Contains))
        {
            return false;
        }

        return true;
    }

    void ClearMessage()
    {
        GameObject chatContainer = GameObject.Find("chatContainer");
        foreach (Transform child in chatContainer.transform)
        {
            Destroy(child.gameObject);
        }
    }

    void ClearOptions()
    {
        GameObject optionsContainer = GameObject.Find("optionsList");
        foreach (Transform child in optionsContainer.transform)
        {
            Destroy(child.gameObject);
        }
    }

    void SelectOption(Option option)
    {
        selectedOptions.Add(option.id);

        if (option.nextStep != 0)
        {
            currentStep = option.nextStep;
            StartCoroutine(LoadQuest(ExecuteStep, currentStep));
        }

        if (option.result != null)
        {
            messages = option.result.messages;

            if (option.result.options != null)
            {
                UpdateOptions(option.result.options);
            }

            currentMessageIndex = 0;

            if (messages.Count > 0)
            {
                ShowNextMessage();
            }

            if (option.item != null)
            {
                player.inventory.Add(option.item);
                ShowMessage("Система", "Получен предмет: " + option.item.name);
            }
        }

        if (option.item != null)
        {
            player.inventory.Add(option.item);
            ShowMessage("Система", "Получен предмет: " + option.item.name);
        }
    }

    void SavePlayerData()
    {
        player.currentStep = currentStep;
        PlayerPrefs.SetString("playerData", JsonUtility.ToJson(player));
    }
}

[System.Serializable]
public class Player
{
    public string name;
    public int health;
    public int attributePoints;
    public int strength;
    public int agility;
    public int intelligence;
    public int charisma;
    public List<Item> inventory;
    public List<int> visitedSteps;
    public List<string> encounteredCharacters;
    public int currentStep;
}

[System.Serializable]
public class Item
{
    public string name;
    public string img_key;
    public Dictionary<string, int> stats;
}

[System.Serializable]
public class QuestStep
{
    public int id;
    public List<Message> messages;
    public Item item;
    public string character;
    public Location location;
    public List<Option> options;
}

[System.Serializable]
public class Message
{
    public string id;
    public string author;
    public string content;
    public string avatar;
    public bool once;
    public List<string> showIfStep;
    public List<string> hideIfStep;
    public Item item;
    public List<string> characters;
}

[System.Serializable]
public class Location
{
    public string image;
}

[System.Serializable]
public class Option
{
    public string id;
    public string text;
    public int nextStep;
    public Message result;
    public List<string> showIfStep;
    public List<string> hideIfStep;
    public Item item;
}
