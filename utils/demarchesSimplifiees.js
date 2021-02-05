async function getPsychologistList(input) { 
    const psyList = [
        {
            'name': 'name1',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name2',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name3',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name4',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name5',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name6',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name7',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name8',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
        {
            'name': 'name9',
            'address': '22 rue du four, 54000 Metz',
            'phone': '010000000',
        },
    ];

    await Promise.all(psyList);
  }
  
  exports.getPsychologistList = getPsychologistList;