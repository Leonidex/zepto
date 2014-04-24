onmessage = function(m)
{
	var cost;
	var km = m.data.distance/1000;	//distance data is received in meters.
	
	if(0>km>900)
	{
		cost = 1.2*km;
	}
	else
	{
		cost = 0.9*km;
	}
	
	if(m.data.chosenCar.Gear == 'manual')
	{
		cost *= 0.9;
	}
	cost = Math.round(cost*100)/100;	//two digits after dot.
	
	setTimeout(function(){postMessage(cost)},3000);
}