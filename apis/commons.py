import paho.mqtt.client as Client
import time
import uuid

Connected = False


def on_connect(client, userdata, flags, rc):
	if rc == 0:
		global Connected
		Connected = True

	else:
		return


def publish_topic_mqtt(value, user='tnuxyfho', password='y2RS8p-Q36fB', topic='khiemtopic'):
	global Connected

	broker_address = "m16.cloudmqtt.com"
	port = 19928

	client = Client.Client(client_id="{client_id}".format(client_id=uuid.uuid1()))
	client.username_pw_set(user, password=password)
	client.on_connect = on_connect
	client.connect(broker_address, port=port)
	client.loop_start()

	while Connected != True:  # Wait for connection
		time.sleep(0.1)

	client.publish(topic, value)
	time.sleep(0.1)
	client.disconnect()
	client.loop_stop()

	return True