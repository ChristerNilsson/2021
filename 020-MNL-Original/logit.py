from collections import OrderedDict
import pylogit as pl
import pandas as pd
import numpy as np
import json
import time

start = time.time()
filename1 = "C:/Users/christer/Downloads/to_logit.json"
filename2 = "C:/Users/christer/Downloads/from_logit.json"

with open(filename1) as f:
    data = json.loads(f.read())


def f(hprp):

    resande = pd.DataFrame(hprp['data'])
    df_spec = OrderedDict()
    df_names = OrderedDict()

    for col, display_name in [("alt2", "lpk_hel"), ("alt3", "rk_hel"), ("alt4", "ek_hel")]:
        df_spec[col] = [[2, 3, 4]]
        df_names[col] = [display_name]

    df_spec['pris'] = [[1, 2, 3, 4]]
    df_names['pris'] = ['Kostnad_per_biljettslag']

    model = pl.create_choice_model(
        data=resande,
        alt_id_col=hprp['alt_id_col'],
        obs_id_col=hprp['obs_id_col'],
        choice_col=hprp['choice_col'],
        specification=df_spec,
        model_type=hprp['model_type'],
        names=df_names
    )

    model_results = model.fit_mle(np.zeros(4), just_point=True)
    mle_params = model_results['x']
    param_list = [mle_params, None, None, None]
    predictions = model.predict(resande, param_list=param_list)
    predictions = pd.Series(predictions, index=resande.index)
    return {'mle_params': list(mle_params), 'predictions': list(predictions)}


hp = f(data['hp'])
rp = f(data['rp'])

with open(filename2,'w') as f:
    f.write(json.dumps({'hp': hp, 'rp': rp}))

print(len(hp['predictions']), 'rader tog', round(time.time()-start,3), 'sekunder')



