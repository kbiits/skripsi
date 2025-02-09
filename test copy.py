import matplotlib.pyplot as plt
import numpy as np

x = [
    "Maeceanastumidst",
    "Sed perpiciatis unde",
    "Voluptatem acusantium dolorque",
    "Nem enim ipsam voluptatem quias voluptas",
    "In reprehenderit voluptate vellit esse cillum dolo",
    "Ut enim ad minima veniam, quihs nostrum exercitationem ullam",
    "Labori nisi ut aliquip ex ea commodo consequat. Duis aute irures dolor",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui offic deserunt",
    "Mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
    "Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et",
]

y = [
    0.056,
    0.014,
    0.013,
    0.011,
    0.015,
    0.019,
    0.015,
    0.013,
    0.014,
    0.026,
]

x_new = list(map(lambda d: d[:10] + "..." if len(d) > 10 else d, x))
bar = plt.plot(
    x_new,
    y
)

for i in range(len(x)):
    plt.text(x_new[i], y[i], str(y[i]) + "ms")


# plt.ylim([40, 110])
plt.gcf().subplots_adjust(bottom=0.3)

# # alternate option without .gcf
# # plt.subplots_adjust(bottom=0.3)

plt.xticks(rotation=90)


plt.xlabel('Pesan')
plt.ylabel('Waktu proses enkripsi (ms)')
plt.title('Hasil pengujian waktu proses enkripsi')
plt.show()
