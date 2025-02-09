import matplotlib.pyplot as plt
import numpy as np

data = [
        {
            "x": "cat\nbat",
            "y": "99,62%",
        },
        {
            "x": "hello\nhallo",
            "y": "99,68%"
        },
        {
            "x": "testing\ntasting",
            "y": "99,93%"
        },
        {
            "x": "abcdefgh\nabcdefgH",
            "y": "99,31%"
        },
        {
            "x": "1234567890\n1234567891",
            "y": "99,68%"
        },
        {
            "x": "lorem ipsum dolor\nlorem ipsum dolot",
            "y": "49,90%"
        },
        {
            "x": "AES-256 encryption\nAES-256 encryptionm",
            "y": "49,78%"
        },
        {
            "x": "avalanche effect test\navalanche effect tast",
            "y": "49,81%"
        },
        {
            "x": "secure data transmission\nsecure data transmissiom",
            "y": "49,75%%"
        },
        {
            "x": "end-to-end encryption is key\nend-to-end encryption is ez",
            "y": "49,87%"
        },
        {
            "x": "with emoji 😭\nwith emoji 🤣",
            "y": "99,62%"
        }
    ];



# Scatter plot with multiple customizations
x = list(map(lambda d: d["x"], data))

y = list(map(lambda d: float(d["y"].replace(",", ".").replace("%", "")), data))

bar = plt.bar(
    x, 
    y,
    width=0.6,
    align="center"
)

for i in range(len(x)):
    plt.text(x[i], y[i], str(y[i]) + "%")


plt.ylim([40, 110])
plt.gcf().subplots_adjust(bottom=0.3)

# # alternate option without .gcf
# # plt.subplots_adjust(bottom=0.3)

plt.xticks(rotation=90)

    
plt.xlabel('Pesan')
plt.ylabel('Avalanche Effect')
plt.title('Hasil pengujian avalanche effect')
plt.show()