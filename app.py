from flask import Flask, render_template, send_from_directory
import mimetypes


app = Flask(__name__, static_url_path='',
            static_folder='./static/',
            )


@app.route('/')
def index():
    return render_template('main.html')


if __name__ == '__main__':
    mimetypes.add_type('application/javascript', '.mjs')
    app.run(debug=True)
